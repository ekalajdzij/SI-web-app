using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Model;
using System.Globalization;

namespace SI_Web_API.Controller;

public static class LoginEndpoints
{
    public static void MapLoginEndpoints(this IEndpointRouteBuilder routes)
    {

        var group = routes.MapGroup("/api/Login");

        group.MapGet("/", async (string username, string password, SI_Web_APIContext db) =>
        {
            var user = await db.User.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
            if (user == null) return Results.NotFound("User not found.");
            else return Results.Ok("User found, token...");
        }).WithName("GetUserByUsername")
        .WithOpenApi();
    }
}
