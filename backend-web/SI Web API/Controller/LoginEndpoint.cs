using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Model;
using System.Globalization;
using System.Text.Json;

namespace SI_Web_API.Controller;

public static class LoginEndpoints
{
    public static void MapLoginEndpoints(this IEndpointRouteBuilder routes)
    {

        var group = routes.MapGroup("/api/login");

        group.MapPost("/", async ([FromBody] JsonElement payload, SI_Web_APIContext db) =>
        {
            var model = JsonSerializer.Deserialize<User>(payload.ToString());
            var user = await db.User.FirstOrDefaultAsync(u => u.Username == model.Username &&
                u.Password == model.Password);
            if (user == null) return Results.NotFound("User not found.");
            else
            {
                // Here should be called AuthService method for generating JWT token
                return Results.Ok("User found, token...");
            }
        }).WithName("GetUserByUsernameAndPassword")
        .WithOpenApi();
    }
}
