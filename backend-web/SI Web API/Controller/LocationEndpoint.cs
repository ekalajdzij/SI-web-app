using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using Microsoft.AspNetCore.Mvc;
namespace SI_Web_API.Controller
{
    public static class LocationEndpoints
    {
        public static void MapLocationEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/location").WithTags(nameof(Location));

            group.MapGet("/{id}", async Task<Results<Ok<Location>, NotFound>> (int id, SI_Web_APIContext db) =>
            {
                return await db.Location.AsNoTracking()
                    .FirstOrDefaultAsync(model => model.Id == id)
                    is Location model
                        ? TypedResults.Ok(model)
                        : TypedResults.NotFound();
            })
            .WithName("GetLocationById")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPost("/", async ([FromBody] Location location, SI_Web_APIContext db) =>
            {
                db.Location.Add(location);
                await db.SaveChangesAsync();
                return TypedResults.Created($"/api/Location/{location.Id}", location);
            })
            .WithName("CreateLocation")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapGet("/", async Task<IEnumerable<Location>> (SI_Web_APIContext db) =>
            {
                return await db.Location.AsNoTracking().ToListAsync();
            }).WithName("GetAllLocations")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPut("/{id}", async Task<Results<Ok<Location>, NotFound>> (int id, [FromBody] Location location, SI_Web_APIContext db) =>
            {
                
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

            group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int id, SI_Web_APIContext db) =>
            {
                var location = await db.Location.FindAsync(id);
                if (location == null) return TypedResults.NotFound();

                db.Location.Remove(location);
                await db.SaveChangesAsync();

                return TypedResults.Ok();
            }).WithName("DeleteLocation")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}