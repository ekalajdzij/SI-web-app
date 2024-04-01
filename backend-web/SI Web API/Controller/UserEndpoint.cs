using SI_Web_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using SI_Web_API.Model;
using SI_Web_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
namespace SI_Web_API.Controller
{
    public static class UserEndpoints
    {
        public class AdminUserInput
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string PhoneNumber { get; set; }
            public string FullName { get; set; }
            public string Mail { get; set; }
            public int CompanyId { get; set; }
        }


        public static void MapUserEndpoints (this IEndpointRouteBuilder routes, string issuer, string key)
        {

            var group = routes.MapGroup("/api/user").WithTags(nameof(User));

            group.MapGet("/", async (HttpContext context, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                return await db.User.ToListAsync();
            })
            .WithName("GetAllUsers")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapGet("/{id}", async Task<Results<Ok<User>, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                return await db.User.AsNoTracking()
                    .FirstOrDefaultAsync(model => model.Id == id)
                    is User model
                        ? TypedResults.Ok(model)
                        : TypedResults.NotFound();
            })
            .WithName("GetUserById")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, [FromBody] AdminUserInput adminInput, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);

                var existingUser = await db.User.FindAsync(id);
                if (existingUser == null)
                    return TypedResults.NotFound();

                if (!string.IsNullOrEmpty(adminInput.PhoneNumber))
                {
                    existingUser.PhoneNumber = adminInput.PhoneNumber;
                }

                if (!string.IsNullOrEmpty(adminInput.Mail))
                {
                    existingUser.Mail = adminInput.Mail;
                }

                if (adminInput.CompanyId != existingUser.CompanyId)
                {
                    existingUser.CompanyId = adminInput.CompanyId;
                }

                await db.SaveChangesAsync();

                return TypedResults.Ok();
            })
            .WithName("UpdateUser")
            .RequireAuthorization()
            .WithOpenApi();


            group.MapPost("/", async (HttpContext context, [FromBody] AdminUserInput adminInput, SI_Web_APIContext db) =>
            {
                var user = new User
                {
                    Username = adminInput.Username,
                    Password = adminInput.Password,
                    PhoneNumber = adminInput.PhoneNumber,
                    FullName = adminInput.FullName,
                    Mail = adminInput.Mail,
                    CompanyId = adminInput.CompanyId,
                    SecretKey = "", 
                    Token = null 
                };
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                db.User.Add(user);
                await db.SaveChangesAsync();
                return TypedResults.Created($"/api/User/{user.Id}",user);
            })
            .WithName("CreateUser")
            .RequireAuthorization()
            .WithOpenApi();

            group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (HttpContext context, int id, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                var affected = await db.User
                    .Where(model => model.Id == id)
                    .ExecuteDeleteAsync();
                return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
            })
            .WithName("DeleteUser")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
