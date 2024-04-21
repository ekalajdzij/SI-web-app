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
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace SI_Web_API.Controller
{
    public static class OCREndpoint
    {
        public static void MapOCREndpoints(this IEndpointRouteBuilder routes, string issuer, string key, string blobConnectionString)
        {

            var group = routes.MapGroup("/api/ocr").WithTags(nameof(Record));

            group.MapPost("/", async Task<Results<Ok<String>, BadRequest>> (HttpContext context, [FromForm] OCRRequest request, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);
                string result = "";
                string name = request.Image.FileName;
                var image = request.Image;
                var memoryStream = new MemoryStream();

                if (image.Length > 0)
                {
                    await image.CopyToAsync(memoryStream);
                    memoryStream.Seek(0, SeekOrigin.Begin);
                }
                
                var blobServiceClient = new BlobServiceClient(blobConnectionString);
                var blobContainerClient = blobServiceClient.GetBlobContainerClient("ocrdata");

              
                var blobName = $"{request.DestinationLanguage}.traineddata";
                var blobClient = blobContainerClient.GetBlobClient(blobName);
                var blobStream = await blobClient.OpenReadAsync();

                var filePath = Path.Combine(Path.GetTempPath(), blobName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await blobStream.CopyToAsync(fileStream);
                }

                using (var engine = new TesseractEngine(Path.GetDirectoryName(filePath), request.DestinationLanguage, EngineMode.Default))
                {
                    using (var img = Pix.LoadFromMemory(memoryStream.ToArray()))
                    {
                        var page = engine.Process(img);
                        result = page.GetText();
                    }
                }
                File.Delete(filePath);
                return TypedResults.Ok(result);
            })
            .WithName("ReadTextFromImage")
            .WithOpenApi()
            .RequireAuthorization()
            .DisableAntiforgery();
        }
    }
}
