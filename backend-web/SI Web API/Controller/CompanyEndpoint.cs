using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using SI_Web_API.Services;
namespace SI_Web_API.Controller
{
    public static class CompanyEndpoints
    {
	    public static void MapCompanyEndpoints (this IEndpointRouteBuilder routes, string issuer, string key)
        {
            var group = routes.MapGroup("/api/company").WithTags(nameof(Company));

            group.MapGet("/", async (HttpContext context, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                return await db.Company.ToListAsync();
            })
            .WithName("GetAllCompanies")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapGet("/{id}", async Task<Results<Ok<Company>, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                return await db.Company.AsNoTracking()
                    .FirstOrDefaultAsync(model => model.Id == id)
                    is Company model
                        ? TypedResults.Ok(model)
                        : TypedResults.NotFound();
            })
            .WithName("GetCompanyById")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, Company company, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var affected = await db.Company
                    .Where(model => model.Id == id)
                    .ExecuteUpdateAsync(setters => setters
                      .SetProperty(m => m.Id, company.Id)
                      .SetProperty(m => m.Name, company.Name)
                      );
                return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
            })
            .WithName("UpdateCompany")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPost("/", async (HttpContext context, Company company, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                db.Company.Add(company);
                await db.SaveChangesAsync();
                return TypedResults.Created($"/api/Company/{company.Id}",company);
            })
            .WithName("CreateCompany")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var affected = await db.Company
                    .Where(model => model.Id == id)
                    .ExecuteDeleteAsync();
                return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
            })
            .WithName("DeleteCompany")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
