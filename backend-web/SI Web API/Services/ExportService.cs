using Microsoft.CodeAnalysis.CSharp.Syntax;
using SI_Web_API.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using System.IO;
using OfficeOpenXml;

namespace SI_Web_API.Services
{
    public class ExportService
    {
        public Task<byte[]> ExportToPdf(IEnumerable<DesignatedLocation> locations)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                // Pdf export logic
                // For now returning a blank PDF

                PdfWriter writer = new PdfWriter(memoryStream);
                PdfDocument pdfDocument = new PdfDocument(writer);
                pdfDocument.AddNewPage();
                pdfDocument.Close();

                return Task.FromResult(memoryStream.ToArray());
            }
        }

        public Task<byte[]> ExportToExcel(IEnumerable<DesignatedLocation> locations)
        {
            using (ExcelPackage excelPackage = new ExcelPackage())
            {
                // Excel export logic
                // For now returning blank Excel worksheet

                var worksheet = excelPackage.Workbook.Worksheets.Add("Locations");

                return Task.FromResult(excelPackage.GetAsByteArray());

            }
        }
    }
}
