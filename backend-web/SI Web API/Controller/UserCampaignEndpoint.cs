using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Dtos;
using SI_Web_API.Model;
using SI_Web_API.Services;
using System.ComponentModel.Design;

namespace SI_Web_API.Controller
{
    public static class UserCampaignEndpoint
    {
        public static void MapUserCampaignEndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
        {
            var group = routes.MapGroup("/api/user/campaigns").WithTags(nameof(UserCampaign));
            group.MapGet("/{userId}/{status}", async (HttpContext context, SI_Web_APIContext db, int userId, string status) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var userCampaigns = await db.UserCampaign
                    .Where(uc => uc.UserId == userId && uc.Status == status)
                    .Select(uc => uc.CampaignId)
                    .ToListAsync();

                var campaigns = await db.Campaign
                    .Where(c => userCampaigns.Contains(c.Id))
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description,
                        c.StartDate,
                        c.EndDate
                    })
                    .ToListAsync();

                return TypedResults.Ok(campaigns);
            })
            .WithName("GetAllCampaignsForUserByStatus")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapGet("/{campaignId}", async (HttpContext context, SI_Web_APIContext db, int campaignId) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var result = await db.UserCampaign
                .Where(uc => uc.CampaignId == campaignId && 
                    (uc.Status == "none" || uc.Status == "accepted"))
                .Join(db.User,
                    uc => uc.UserId,
                    u => u.Id,
                    (uc, u) => new
                    {
                        uc.Id,
                        uc.CampaignId,
                        uc.UserId,
                        u.Username,
                        uc.Status
                    })
                .ToListAsync();

                return TypedResults.Ok(result);
            })
            .WithName("GetAllUsersForCampaign")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPut("/", async (HttpContext context, SI_Web_APIContext db, [FromBody] UpdateUserCampaignRequest payload) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var userCampaign = await db.UserCampaign
                    .FirstOrDefaultAsync(uc => uc.UserId == payload.UserId && uc.CampaignId == payload.CampaignId);

                if (userCampaign == null)
                {
                    return Results.NotFound("User campaign not found.");
                }
                if (payload.Status != "accepted" && payload.Status != "declined" && payload.Status != "none") return Results.BadRequest("Invalid status.");
                else
                {
                    userCampaign.Status = payload.Status;
                    await db.SaveChangesAsync();

                    return TypedResults.Ok(new { status = "OK" });
                }
            })
            .WithName("UpdateCampaignStatus")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPost("/", async (HttpContext context, [FromBody] UserCampaign userCampaign, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                db.UserCampaign.Add(userCampaign);
                await db.SaveChangesAsync();
                return TypedResults.Ok(userCampaign);
            })
            .WithName("CreateCampaignForUser")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapDelete("/{userCampaignId}", async (HttpContext context, int userCampaignId, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var userCampaign = await db.UserCampaign.FindAsync(userCampaignId);
                if (userCampaign == null)
                {
                    return Results.NotFound("User-Campaign mapping not found.");
                }

                db.UserCampaign.Remove(userCampaign);
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .WithName("DeleteUserCampaign")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
