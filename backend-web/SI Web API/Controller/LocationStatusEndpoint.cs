using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using SI_Web_API.Dtos;
using Microsoft.AspNetCore.Mvc;
using SI_Web_API.Services;
namespace SI_Web_API.Controller
{
    public static class LocationStatusEndpoints
{
	public static void MapLocationStatusEndpoints (this IEndpointRouteBuilder routes, string issuer, string key)
    {
        var group = routes.MapGroup("/api/LocationStatus").WithTags(nameof(LocationStatus));

            group.MapPut("/", async Task<Results<Ok<LocationStatus>, NotFound>> (HttpContext context,
                [FromBody] UpdateLocationStatusRequest request, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var existingLocationStatus = await db.LocationStatus.FirstOrDefaultAsync(ls =>
                    ls.UserId == request.UserId && ls.LocationId == request.LocationId);
                if (existingLocationStatus == null) return TypedResults.NotFound();

                existingLocationStatus.Status = request.Status;

                db.LocationStatus.Update(existingLocationStatus);
                await db.SaveChangesAsync();

                return TypedResults.Ok(existingLocationStatus);

            }).WithName("UpdateLocationStatus")
            .RequireAuthorization()
            .WithOpenApi();


            group.MapGet("/{UserId}/{status}", async (HttpContext context, int UserId, string status, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var locStatus = await db.LocationStatus
                               .Where(ls => ls.UserId == UserId && ls.Status == status)
                               .Select(ls => new
                               {
                                   ls.LocationId,
                               })
                               .ToListAsync();

                return Results.Ok(locStatus);

            }).WithName("GetLocationId")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
