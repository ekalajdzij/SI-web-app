using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

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
        public static string GetSha256Hash(string input)
        {
            using (var sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static string CalculateHmac256(string input, string key)
        {
            /*byte[] keyBytes = Convert.FromBase64String(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);

            using (HMACSHA256 hmac = new HMACSHA256(keyBytes))
            {
                byte[] hashBytes = hmac.ComputeHash(inputBytes);
                return Convert.ToBase64String(hashBytes);
            }*/
            var hmacsha256 = new System.Security.Cryptography.HMACSHA256();
            hmacsha256.Key = Convert.FromBase64String(key);
            var signature = hmacsha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(signature);
        }
    }
}
