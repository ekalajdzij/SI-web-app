using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
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

                if (request.Status != null)
                {
                    existingLocationStatus.Status = request.Status;
                }

                db.LocationStatus.Update(existingLocationStatus);
                await db.SaveChangesAsync();

                return TypedResults.Ok(existingLocationStatus);

            }).WithName("UpdateLocationStatus")
            .RequireAuthorization()
            .WithOpenApi();
        }
}}
