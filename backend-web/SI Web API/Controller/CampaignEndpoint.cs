using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Model;
using SI_Web_API.Services;
using System.ComponentModel.Design;
using static SI_Web_API.Controller.UserEndpoints;

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
                        l.Id,
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

            group.MapGet("/company/{companyId}", async (HttpContext context, int companyId, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var campaigns = await db.Campaign
                    .Where(campaign => campaign.CompanyId == companyId)
                    .ToListAsync();

                if (campaigns == null)
                {
                    return Results.NotFound("Campaign not found.");
                }

                return TypedResults.Ok(campaigns);
            })
            .WithName("GetCampaignsWithCompanyId")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPost("/", async (HttpContext context, [FromBody] Campaign campaignRequest, SI_Web_APIContext db) =>
            {
                var campaign = new Campaign
                {
                    Name = campaignRequest.Name,
                    Description = campaignRequest.Description,
                    CompanyId = campaignRequest.CompanyId,
                    StartDate = campaignRequest.StartDate,
                    EndDate = campaignRequest.EndDate
                };
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                db.Campaign.Add(campaign);
                await db.SaveChangesAsync();
                return TypedResults.Created($"/api/campaigns/{campaign.Id}", campaign);
            })
            .WithName("CreateCampaign")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapGet("/", async (HttpContext context, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var campaigns = await db.Campaign.ToListAsync();
                return TypedResults.Ok(campaigns);
            })
            .WithName("GetAllCampaigns")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPut("/{campaignId}", async (HttpContext context, int campaignId, [FromBody] Campaign campaignRequest, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var campaign = await db.Campaign.FindAsync(campaignId);
                if (campaign == null)
                {
                    return Results.NotFound("Campaign not found.");
                }

                if (campaignRequest.Name != null)
                {
                    campaign.Name = campaignRequest.Name;
                }

                if (campaignRequest.Description != null)
                {
                    campaign.Description = campaignRequest.Description;
                }

                if (campaignRequest.StartDate != null)
                {
                    campaign.StartDate = campaignRequest.StartDate;
                }

                if (campaignRequest.EndDate != null)
                {
                    campaign.EndDate = campaignRequest.EndDate;
                }

                await db.SaveChangesAsync();
                return TypedResults.Ok(campaign);
            })
            .WithName("UpdateCampaign")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapDelete("/{campaignId}", async (HttpContext context, int campaignId, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var campaign = await db.Campaign.FindAsync(campaignId);
                if (campaign == null)
                {
                    return Results.NotFound("Campaign not found.");
                }

                db.Campaign.Remove(campaign);
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .WithName("DeleteCampaign")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
