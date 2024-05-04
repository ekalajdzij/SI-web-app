using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using Microsoft.AspNetCore.Mvc;
using SI_Web_API.Services;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using SI_Web_API.Dtos;
namespace SI_Web_API.Controller
{
    public static class LocationEndpoints
{   

	public static void MapLocationEndpoints (this IEndpointRouteBuilder routes, string issuer, string key, string azureAccKey, string blobConnectionString)
    {
        var group = routes.MapGroup("/api/location").WithTags(nameof(Location));

        group.MapGet("/{id}", async Task<Results<Ok<Location>, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            return await db.Location.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Location model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetLocationById")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapGet("/", async Task<IEnumerable<Location>> (HttpContext context, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            return await db.Location.AsNoTracking().ToListAsync();
        }).WithName("GetAllLocations")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok<Location>, NotFound>> (HttpContext context, int id, [FromBody] Location location, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            var existingLocation = await db.Location.FindAsync(id);
            if (existingLocation == null) return TypedResults.NotFound();

            if (location.TypeOfLocation != null)
            {
                existingLocation.TypeOfLocation = location.TypeOfLocation;
            }

            if (location.Address != null)
            {
                existingLocation.Address = location.Address;
            }

            if (location.ContactNumber != null)
            {
                existingLocation.ContactNumber = location.ContactNumber;
            }

            if (location.Description != null)
            {
                existingLocation.Description = location.Description;
            }

            db.Location.Update(existingLocation);
            await db.SaveChangesAsync();

            return TypedResults.Ok(existingLocation);

        }).WithName("UpdateLocation")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            var location = await db.Location.FindAsync(id);
            if (location == null) return TypedResults.NotFound();

            var locationStatus = await db.LocationStatus.Where(ls => ls.LocationId == id).ToListAsync();
            if (locationStatus != null)
            {
                db.LocationStatus.RemoveRange(locationStatus);
                await db.SaveChangesAsync();
            }
            
            var record = await db.Record.Where(r => r.LocationId == id).ToListAsync();
            if (record != null)
            {
                db.Record.RemoveRange(record);
                await db.SaveChangesAsync();
            }

            db.Location.Remove(location);
            await db.SaveChangesAsync();

            return TypedResults.Ok();
        }).WithName("DeleteLocation")
        .RequireAuthorization()
        .WithOpenApi();
        
        group.MapPost("/", async (HttpContext context, [FromBody] Location location, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            db.Location.Add(location);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Location/{location.Id}",location);
        })
        .WithName("CreateLocation")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapPost("/record/", async (HttpContext context, [FromForm] RecordRequest recordData, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            Record record = new Record();
            string url = "";
            using (var stream = recordData.Image.OpenReadStream())
            {
                BlobStorageService blobStorage = new BlobStorageService(blobConnectionString);
                url = await blobStorage.UploadFileToBlobAsync(recordData.Image.FileName, recordData.Image.ContentType, stream);
            }
            record.SerialNumber = recordData.SerialNumber;
            record.InventoryNumber = recordData.InventoryNumber;
            record.GPSCoordinates = recordData.GPSCoordinates;
            record.FullAddress = recordData.FullAddress;
            record.PhotoUrl = url;
            record.CreatedAt = recordData.CreatedAt;
            record.LocationId = recordData.LocationId;
            record.UserId = recordData.UserId;
            db.Record.Add(record);
            await db.SaveChangesAsync();
            return TypedResults.Ok();
        })
        .WithName("CreateRecord")
        .RequireAuthorization()
        .DisableAntiforgery()
        .WithOpenApi();

        group.MapGet("/record/coordinates/{campaignId}", async (HttpContext context, int campaignId, SI_Web_APIContext db) =>
        {
            var mergedData = await (from locationTable in db.Location
                                    join recordTable in db.Record on locationTable.Id equals recordTable.LocationId
                                    where locationTable.CampaignId == campaignId
                                    select new
                                    {
                                        LocationId = locationTable.Id,
                                        Coordinates = recordTable.GPSCoordinates
                                    }).ToListAsync();
            return mergedData;
        }).WithName("GetCoordinates")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapGet("/record/{locationId}", async (HttpContext context, int locationId, SI_Web_APIContext db) =>
        {
            var records = await db.Record.Where(r => r.LocationId == locationId)
            .Select(r => new
            {
                r.Id,
                r.SerialNumber,
                r.InventoryNumber,
                r.GPSCoordinates,
                r.FullAddress,
                r.PhotoUrl,
                r.LocationId,
                r.UserId
            }).ToListAsync();
            return records;
        }).WithName("GetRecordsByLocationId")
        .RequireAuthorization()
        .WithOpenApi();

        group.MapGet("/company/record/{companyId}",async (HttpContext context, int companyId, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);

            var campaignIds = await db.Campaign
                .Where(c => c.CompanyId == companyId)
                .Select(c => c.Id)
                .ToListAsync();

                if (campaignIds.Count == 0)
                {
                    return Results.NotFound();
                }

                var locationsAndRecords = await (from location in db.Location
                                                 join record in db.Record on location.Id equals record.LocationId
                                                 where campaignIds.Contains(location.CampaignId)
                                                 select new
                                                 {
                                                     Location = location,
                                                     Record = record
                                                 }).ToListAsync();

                return Results.Ok(locationsAndRecords);
            }).WithName("GetRecordsForCompany")
              .RequireAuthorization()
              .WithOpenApi();

        }
    }
}
