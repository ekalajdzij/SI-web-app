using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;

namespace SI_Web_API.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<BlobStorageService> _logger;
        string blobStorageconnection = string.Empty;
        private string blobContainerName = "locationimages";
        public BlobStorageService(string connectionstring)
        {
            blobStorageconnection = connectionstring;
        }
        public async Task<string> UploadFileToBlobAsync(string strFileName, string contentType, Stream fileStream)
        {
            try
            {
                var container = new BlobContainerClient(blobStorageconnection, blobContainerName);
                var createResponse = await container.CreateIfNotExistsAsync();
                if (createResponse != null && createResponse.GetRawResponse().Status == 201)
                    await container.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
                var blob = container.GetBlobClient(strFileName);
                await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
                await blob.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });
                var urlString = blob.Uri.ToString();
                return urlString;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex.ToString());
                throw;
            }
        }
        public async Task<bool> DeleteFileToBlobAsync(string strFileName)
        {
            try
            {
                var container = new BlobContainerClient(blobStorageconnection, blobContainerName);
                var createResponse = await container.CreateIfNotExistsAsync();
                if (createResponse != null && createResponse.GetRawResponse().Status == 201)
                    await container.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
                var blob = container.GetBlobClient(strFileName);
                await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex.ToString());
                throw;
            }
        }
    }
}