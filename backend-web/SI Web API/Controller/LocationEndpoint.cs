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
	public static void MapLocationEndpoints (this IEndpointRouteBuilder routes)
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
        .WithOpenApi();

        group.MapPost("/", async ([FromBody] Location location, SI_Web_APIContext db) =>
        {
            db.Location.Add(location);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Location/{location.Id}",location);
        })
        .WithName("CreateLocation")
        .WithOpenApi();
    }
}}
