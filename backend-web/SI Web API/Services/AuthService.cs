using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SI_Web_API.Services
{
    public static class AuthService
    {
        public static string GenerateJwtToken(string issuer, string key)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var Sectoken = new JwtSecurityToken(issuer,
              issuer,
              null,
              expires: DateTime.UtcNow.AddMinutes(30),
              signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
            return token;
        }

        public static void ExtendJwtTokenExpirationTime(HttpContext context, string issuer, string key)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                var tokenValidationParams = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key))
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParams, out var validatedToken);

                var expiryTime = validatedToken.ValidTo;

                if (expiryTime > DateTime.UtcNow) 
                {
                    var newToken = GenerateJwtToken(validatedToken.Issuer, key);
                    context.Response.Headers.Add("Authorization", "Bearer " + newToken);
                }
            }
        }
    }
}
