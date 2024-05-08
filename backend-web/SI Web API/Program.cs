using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SI_Web_API.Data;
using SI_Web_API.Controller;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Any;
using Microsoft.Extensions.FileProviders;
using FluentAssertions.Common;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SI_Web_APIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("azuredatabase") ?? throw new InvalidOperationException("Connection string 'SI_Web_APIContext' not found.")));

var azureAccKey = builder.Configuration.GetSection("AzureStorage:Key").Get<string>();

//Jwt configuration
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();


var blobConnectionString = builder.Configuration.GetSection("AzureStorage:ConnectionString").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = jwtIssuer,
         ValidAudience = jwtIssuer,
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
     };
 });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", buildOptions =>
    {
        buildOptions.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowAnyOrigin()
               .WithExposedHeaders("Authorization");
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Dodavanje definicije SecurityScheme za JWT tokene
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    // Dodavanje globalnih zahteva za sigurnost (Security Requirement) koji koriste JWT tokene
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


app.MapDesignatedLocationEndpoints(jwtIssuer, jwtKey);

app.MapLoginEndpoints(jwtIssuer, jwtKey);

app.MapCompanyEndpoints(jwtIssuer, jwtKey);

app.MapUserEndpoints(jwtIssuer, jwtKey);

app.MapUserCampaignEndpoints(jwtIssuer, jwtKey);

app.MapCampaignEndpoints(jwtIssuer, jwtKey);

app.MapAdminEndpoints(jwtIssuer, jwtKey);

app.MapLocationEndpoints(jwtIssuer, jwtKey, azureAccKey, blobConnectionString);

app.MapLocationStatusEndpoints(jwtIssuer, jwtKey);
app.MapOCREndpoints(jwtIssuer, jwtKey, blobConnectionString);

app.Run();
public partial class Program { }