using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
using SI_Web_API.Data;
using SI_Web_API.Model;
namespace SI_Web_API.Controller;

public static class DesignatedLocationEndpoints
{
    public static void MapDesignatedLocationEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/DesignatedLocation").WithTags(nameof(DesignatedLocation));

        group.MapGet("/", async (SI_Web_APIContext db) =>
        {
            return await db.DesignatedLocation.ToListAsync();
        })
        .WithName("GetAllDesignatedLocations")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<DesignatedLocation>, NotFound>> (int tid, SI_Web_APIContext db) =>
        {
            return await db.DesignatedLocation.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Tid == tid)
                is DesignatedLocation model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetDesignatedLocationById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int tid, DesignatedLocation designatedLocation, SI_Web_APIContext db) =>
        {
            var affected = await db.DesignatedLocation
                .Where(model => model.Tid == tid)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Tid, designatedLocation.Tid)
                    .SetProperty(m => m.RecordSerialNumber, designatedLocation.RecordSerialNumber)
                    .SetProperty(m => m.InventoryNumber, designatedLocation.InventoryNumber)
                    .SetProperty(m => m.Latitude, designatedLocation.Latitude)
                    .SetProperty(m => m.Longitude, designatedLocation.Longitude)
                    .SetProperty(m => m.Address, designatedLocation.Address)
                    .SetProperty(m => m.Image, designatedLocation.Image)
                    );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateDesignatedLocation")
        .WithOpenApi();

        group.MapPost("/", async (DesignatedLocation designatedLocation, SI_Web_APIContext db) =>
        {
            db.DesignatedLocation.Add(designatedLocation);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/DesignatedLocation/{designatedLocation.Tid}", designatedLocation);
        })
        .WithName("CreateDesignatedLocation")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int tid, SI_Web_APIContext db) =>
        {
            var affected = await db.DesignatedLocation
                .Where(model => model.Tid == tid)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteDesignatedLocation")
        .WithOpenApi();
    }
}
