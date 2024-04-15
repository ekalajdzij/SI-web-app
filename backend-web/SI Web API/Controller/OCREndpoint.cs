using SI_Web_API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Model;
using SI_Web_API.Services;
using SI_Web_API.Dtos;
using System;
using System.IO;
using System.Threading.Tasks;
using Tesseract;
using Microsoft.AspNetCore.Http.HttpResults;

namespace SI_Web_API.Controller
{
    public static class OCREndpoint
    {
        public const string trainedDataFolderName = "tessdata";
        public static void MapOCREndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
        {

            var group = routes.MapGroup("/api/ocr").WithTags(nameof(Record));

            group.MapPost("/", async Task<Results<Ok<String>, BadRequest>> (HttpContext context, [FromForm] OCRRequest request, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                string name = request.Image.FileName;
                var image = request.Image;
                var memoryStream = new MemoryStream();

                if (image.Length > 0)
                {
                    await image.CopyToAsync(memoryStream);
                    memoryStream.Seek(0, SeekOrigin.Begin);
                }
                var appPath = Path.GetDirectoryName(Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory));
                appPath = Path.GetDirectoryName(appPath);
                appPath = Path.GetDirectoryName(appPath);
                var tessPath = Path.Combine(appPath, trainedDataFolderName);
                string result = "";

                using (var engine = new TesseractEngine(tessPath, request.DestinationLanguage, EngineMode.Default))
                {
                    using (var img = Pix.LoadFromMemory(memoryStream.ToArray()))
                    {
                        var page = engine.Process(img);
                        result = page.GetText();
                    }
                }
                return TypedResults.Ok(result);
            })
            .WithName("ReadTextFromImage")
            .WithOpenApi()
            .RequireAuthorization()
            .DisableAntiforgery();
        }
    }
}
