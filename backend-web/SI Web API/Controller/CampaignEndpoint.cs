using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Model;
using SI_Web_API.Services;

namespace SI_Web_API.Controller
{
    public static class CampaignEndpoint
    {
        public static void MapCampaignEndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
        {
            var group = routes.MapGroup("/api/campaigns").WithTags(nameof(Campaign));
            group.MapGet("/{campaignId}", async (HttpContext context,  int campaignId, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var campaign = await db.Campaign.FindAsync(campaignId);

                if (campaign == null)
                {
                    return Results.NotFound("Campaign not found.");
                }

                var locations = await db.Location
                    .Where(l => l.CampaignId == campaignId)
                    .Select(l => new
                    {
                        l.TypeOfLocation,
                        l.Address,
                        l.ContactNumber,
                        l.Description
                    })
                    .ToListAsync();

                var campaignDetails = new
                {
                    campaign.Id,
                    campaign.Name,
                    campaign.Description,
                    campaign.StartDate,
                    campaign.EndDate,
                    Locations = locations
                };

                return TypedResults.Ok(campaignDetails);
            })
            .WithName("GetCampaignDetails")
            .RequireAuthorization()
            .WithOpenApi();

        }
    }
}
