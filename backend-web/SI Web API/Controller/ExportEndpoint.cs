using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Data;
using SI_Web_API.Model;
using SI_Web_API.Services;
using OfficeOpenXml;
using System.Collections.Generic;
using System.Composition;

namespace SI_Web_API.Controller
{
    public static class ExportEndpoints
    {
        public static void MapExportEndpoints(this IEndpointRouteBuilder routes, string issuer, string key)
        {
            var group = routes.MapGroup("/export").WithTags(nameof(Record));

            group.MapGet("/excel/campaign/{campaignId}", async (HttpContext context, int campaignId, SI_Web_APIContext db) =>
            {
                AuthService.ExtendJwtTokenExpirationTime(context, issuer, key);

                var campaign = await db.Campaign
                    .Include(c => c.Locations)
                    .FirstOrDefaultAsync(c => c.Id == campaignId);

                if (campaign == null)
                {
                    return Results.NotFound("Campaign not found.");
                }

                var locationIds = campaign.Locations.Select(l => l.Id).ToList();

                var records = await db.Record
                    .Where(r => locationIds.Contains(r.LocationId ?? 0))
                    .Select(r => new
                    {
                        r.Id,
                        r.SerialNumber,
                        r.InventoryNumber,
                        r.GPSCoordinates,
                        r.FullAddress,
                        LocationName = db.Location.Where(l => l.Id == r.LocationId).Select(l => l.TypeOfLocation).FirstOrDefault()
                    })
                    .ToListAsync();

                var stream = new MemoryStream();
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.Add("CampaignRecords");

                    //campaign name
                    worksheet.Cells[1, 1].Value = "Campaign Name:";
                    worksheet.Cells[1, 2].Value = campaign.Name;

                    //headers
                    worksheet.Cells[3, 1].Value = "Location Name";
                    worksheet.Cells[3, 2].Value = "Serial Number";
                    worksheet.Cells[3, 3].Value = "Inventory Number";
                    worksheet.Cells[3, 4].Value = "GPS Coordinates";
                    worksheet.Cells[3, 5].Value = "Full Address";

                    //records
                    for (var i = 0; i < records.Count; i++)
                    {
                        var record = records[i];
                        worksheet.Cells[i + 4, 1].Value = record.LocationName;
                        worksheet.Cells[i + 4, 2].Value = record.SerialNumber;
                        worksheet.Cells[i + 4, 3].Value = record.InventoryNumber;
                        worksheet.Cells[i + 4, 4].Value = record.GPSCoordinates;
                        worksheet.Cells[i + 4, 5].Value = record.FullAddress;
                    }
                    
                    worksheet.Column(1).Width = 20;
                    worksheet.Column(2).Width = 20;
                    worksheet.Column(3).Width = 20;
                    worksheet.Column(4).Width = 25;
                    worksheet.Column(5).Width = 20;
                    worksheet.Column(6).Width = 20;

                    worksheet.Cells[1, 1, 1, 2].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Campaign Name
                    worksheet.Cells[3, 1, 3, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Headers
                    worksheet.Cells[4, 1, records.Count + 3, 6].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Records


                    package.Save();
                }

                stream.Position = 0;
                var content = stream.ToArray();

                return Results.File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Campaign-{campaignId}-Records.xlsx");
            })
            .WithName("ExportCampaignToExcel")
            .RequireAuthorization()
            .WithOpenApi();
        }
    }
}
