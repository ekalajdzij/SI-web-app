using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using SI_Web_API.Data;
using SI_Web_API.Model;
using SI_Web_API.Services;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;

namespace SI_Web_API.Controller;

[Authorize]
public static class LoginEndpoints
{
    public static void MapLoginEndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
    {

        var group = routes.MapGroup("/api/login").WithTags(nameof(User));

        group.MapPost("/", async (HttpContext httpContext, [FromBody] User payload, SI_Web_APIContext db) =>
        {
            var user = await db.User.FirstOrDefaultAsync(u => u.Username == payload.Username &&
                u.Password == payload.Password);
            if (user == null) return Results.NotFound("User not found.");
            else
            {
                payload.FullName = user.FullName;
                payload.Token = AuthService.GenerateJwtToken(issuer, key); ;
                payload.Role = user.Role;
                payload.Mail = user.Mail;
                return Results.Ok(payload);
            }
        }).WithName("GetUserByUsernameAndPassword")
        .AllowAnonymous()
        .WithOpenApi();
    }
}
