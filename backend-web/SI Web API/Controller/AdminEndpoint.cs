using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using SI_Web_API.Services;
using Microsoft.AspNetCore.Mvc;



/*
Za koristenje bilo koje rute potrebno je ulogovati se na rutu 
POST /api/login bilo to na localhostu ili na deployanom serveru.

Nakon slanja body-a sa username i password u response-u se dobija token. 
Taj token iz response-a stavljate u Authorization -> Bearer Token (Postman)

Nakon toga pravite pozive za admin endpoint.

Ova ruta sluzi za kreiranje obicnih admina. 
SuperAdmin se ne moze dodati putem ovih ruta.
 */
namespace SI_Web_API.Controller
{
    public static class AdminEndpoints
    {
        public static void MapAdminEndpoints (this IEndpointRouteBuilder routes, string issuer, string key)
        {
            var group = routes.MapGroup("/api/admin").WithTags(nameof(Admin));

            /* Ruta GET /api/admin vraca sve admine sa atributima:
            {
                "id": 5,
                "username": "string",
                "password": "string",
                "phoneNumber": "string",
                "secretKey": "string",
                "token": null,
                "isSuperAdmin": bool,
                "company": null/naziv kompanije
            }
            */
            group.MapGet("/", async (HttpContext context, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var admins = await db.Admin
                                    .Include(a => a.Company)
                                    .ToListAsync();

                // Mapiranje admina na novi oblik koji uključuje naziv kompanije umjesto companyId
                var adminsWithCompanyName = admins.Select(a => new
                {
                    Id = a.Id,
                    Username = a.Username,
                    Password = a.Password,
                    PhoneNumber = a.PhoneNumber,
                    SecretKey = a.SecretKey,
                    Token = a.Token,
                    IsSuperAdmin = a.IsSuperAdmin,
                    Company = a.Company != null ? a.Company.Name : null  // Koristenje naziva kompanije umjesto companyId
                });

                return adminsWithCompanyName;
            })
            .WithName("GetAllAdmins")
            .RequireAuthorization()
            .WithOpenApi();


            // Ruta GET /api/admin/{id} vraca admina sa atributima na osnovu id
            group.MapGet("/{id}", async Task<Results<Ok<Admin>, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                return await db.Admin.AsNoTracking()
                    .FirstOrDefaultAsync(admin => admin.Id == id)
                    is Admin admin
                        ? TypedResults.Ok(admin)
                        : TypedResults.NotFound();
            })
            .WithName("GetAdminById")
            .RequireAuthorization()
            .WithOpenApi();

            /* Ruta PUT /api/admin/{id} pravi update admina sa atributima u body-u npr. update admina sa id 14:
            {
              "id": 14,
              "username": "updatedAdmin1",
              "password": "updatedPassword123",
              "phoneNumber": "987654321",
              "secretKey": "",
              "isSuperAdmin": false,
              "companyId": 1
            }
            U slucaju da treba da companyId bude null, onda se on izostavlja iz body-a
            */
            group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, [FromBody] Admin admin, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);

                // Postavljanje isSuperAdmin na false
                admin.IsSuperAdmin = false;

                // Postavljanje stanja objekta na Modified
                db.Entry(admin).State = EntityState.Modified;

                // Spremanje promjena u bazu podataka
                await db.SaveChangesAsync();

                return TypedResults.Ok();
            })
            .WithName("UpdateAdmin")
            .RequireAuthorization()
            .WithOpenApi();


            /* Ruta POST /api/admin/ dodaje admina sa atributima u body-u:
            {
              "username": "admin1",
              "password": "password123",
              "phoneNumber": "123456789",
              "secretKey": "", -> prazan string!
              "companyId": 1
            }
            U slucaju da treba da companyId bude null, onda se on izostavlja iz body-a
            */
            group.MapPost("/", async (HttpContext context, [FromBody] Admin admin, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);

                // Postavljanje isSuperAdmin na false po default-u
                admin.IsSuperAdmin = false;

                // Dodavanje admina u bazu podataka
                db.Admin.Add(admin);
                await db.SaveChangesAsync();

                return TypedResults.Created($"/api/admin/{admin.Id}", admin);
            })
            .WithName("CreateAdmin")
            .RequireAuthorization()
            .WithOpenApi();


            // Ruta DELETE /api/admin/{id} brise admina na osnovu id
            group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var admin = await db.Admin.FindAsync(id);
                if (admin == null)
                {
                    return TypedResults.NotFound();
                }

                db.Admin.Remove(admin);
                await db.SaveChangesAsync();
                return TypedResults.Ok();
            })
            .WithName("DeleteAdmin")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
