using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using QRCoder;
using SI_Web_API.Data;
using SI_Web_API.Dtos;
using SI_Web_API.Model;
using SI_Web_API.Services;
using System.Drawing;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.IO;
using System.Security.Cryptography;

namespace SI_Web_API.Controller;

public static class LoginEndpoints
{
    public static void MapLoginEndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
    {

        var group = routes.MapGroup("/api/login").WithTags(nameof(User));

        group.MapPost("/", async (HttpContext httpContext, [FromBody] LoginRequest payload, SI_Web_APIContext db) =>
        {
            var hashedPassword = AuthService.GetSha256Hash(payload.Password);
            var user = await db.User.FirstOrDefaultAsync(u => (u.Username == payload.Username || u.PhoneNumber == payload.Username) &&
                u.Password == hashedPassword);

            if (user == null) return Results.NotFound("User not found.");
            else
            {
                user.Token = AuthService.GenerateJwtToken(issuer, key);
                return Results.Ok(new
                {
                    user.Id,
                    user.Username,
                    payload.Password,
                    user.PhoneNumber,
                    user.FullName,
                    user.Token,
                    user.Mail,
                    user.Role,
                    user.SecretKey
                });
            }
        }).WithName("GetUserByUsernameAndPassword")
        .AllowAnonymous()
        .WithOpenApi();

        group.MapPost("/setup/2fa", async (HttpContext httpContext, SI_Web_APIContext db, [FromBody] LoginRequest payload) =>
        {
            var hashedPassword = AuthService.GetSha256Hash(payload.Password);
            var user = await db.User.FirstOrDefaultAsync(u => (u.Username == payload.Username || u.PhoneNumber == payload.Username) &&
                u.Password == hashedPassword);
            if (user == null) return Results.NotFound("User not found.");
            else
            {
                var setup2fa = TwoFactorAuthService.GenerateSetupCode(user, db);
                return Results.Ok(new
                {
                    ManualEntryKey = setup2fa.ManualEntryKey,
                    QRCodeImageUrl = $"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=otpauth://totp/SIWeb%20App:{Uri.EscapeDataString(user.FullName)}%3Fsecret={setup2fa.ManualEntryKey}%26issuer=SIWeb%20App"
                });
            }
        }).WithName("SetupTwoFactorAuth")
        .AllowAnonymous();


        group.MapPost("/authenticate/2fa", async (HttpContext httpContext, string code, SI_Web_APIContext db, [FromBody] LoginRequest payload) =>
        {
            var hashedPassword = AuthService.GetSha256Hash(payload.Password);
            var user = await db.User.FirstOrDefaultAsync(u => (u.Username == payload.Username || u.PhoneNumber == payload.Username) &&
                u.Password == hashedPassword);
            if (user == null) return Results.NotFound("User not found.");
            else
            {
                AuthService.ExtendJwtTokenExpirationTime(httpContext, issuer, key);
                bool isValidToken = TwoFactorAuthService.ValidateToken(user.SecretKey, code);
                if (!isValidToken) return Results.BadRequest("Invalid code. Please try again.");
                else
                {
                    return Results.Ok();
                }
            }
        }).WithName("AuthorizeToken");


    }
}