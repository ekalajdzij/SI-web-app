using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using Microsoft.AspNetCore.Mvc;
using HandlebarsDotNet;
using SI_Web_API.Services;
namespace SI_Web_API.Controller
{
public static class LocationEndpoints
{
	public static void MapLocationEndpoints (this IEndpointRouteBuilder routes, string issuer, string key)
    {
        var group = routes.MapGroup("/api/location").WithTags(nameof(Location));

        group.MapGet("/{id}", async Task<Results<Ok<Location>, NotFound>> (int id, HttpContext context, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            return await db.Location.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Location model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetLocationById")
        .WithOpenApi();

        group.MapPost("/", async ([FromBody] Location location, HttpContext context, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            db.Location.Add(location);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Location/{location.Id}",location);
        })
        .WithName("CreateLocation")
        .WithOpenApi();

        group.MapGet("/", async (HttpContext context, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            return await db.Location.AsNoTracking().ToListAsync();
        })
        .WithName("GetAllLocations")
        .WithOpenApi();

        group.MapPut("/{id}", async (int id, [FromBody] Location location, HttpContext context, SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            var existingLocation = await db.Location.FirstOrDefaultAsync(l => l.Id == id);
            if (existingLocation == null)
                return TypedResults.NotFound();

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

             return Results.Ok(existingLocation);
        }).WithName("UpdateLocation")
          .WithOpenApi();


        group.MapDelete("/{id}", async (int id, HttpContext context,SI_Web_APIContext db) =>
        {
            AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
            var existingLocation = await db.Location.FirstOrDefaultAsync(c => c.Id == id);
             if (existingLocation == null)
                return TypedResults.NotFound("Location not Found.");

             db.Location.Remove(existingLocation);
             await db.SaveChangesAsync();

             return Results.Ok();
        }).WithName("DeleteLocation")
          .RequireAuthorization()
          .WithOpenApi();
    }
}}
