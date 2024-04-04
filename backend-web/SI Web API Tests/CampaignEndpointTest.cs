using Microsoft.AspNetCore.Mvc.Testing;
using SI_Web_API.Model;
using System;
using System.Collections.Generic;
using System.Drawing.Text;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SI_Web_API_Tests
{
    public class CampaignEndpointTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;
        public CampaignEndpointTest(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }
        [Fact]
        public async Task TestGetCampaignDescription_Authorized_ReturnsOk()
        {
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };

            var loginResponse = await _client.SendAsync(loginRequest);
            loginResponse.EnsureSuccessStatusCode(); 

            var loginContent = await loginResponse.Content.ReadAsStringAsync();
            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);
           

            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/campaigns/28"); 

            request.Headers.Add("Authorization", $"Bearer {token}");

         
            var response = await _client.SendAsync(request);

       
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseBody = await response.Content.ReadAsStringAsync();
            var campaign = JsonSerializer.Deserialize<Campaign>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.NotNull(campaign);
            Assert.NotNull(campaign.Description);
        }
        [Fact]
        public async Task TestGetCampaignDescription_InvalidCampaignId_ReturnsNotFound()
        {
            
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };

          
            var loginResponse = await _client.SendAsync(loginRequest);
            loginResponse.EnsureSuccessStatusCode();

            
            var loginContent = await loginResponse.Content.ReadAsStringAsync();
            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/campaigns/999");

            request.Headers.Add("Authorization", $"Bearer {token}");

           
            var response = await _client.SendAsync(request);

            
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task TestGetCampaignsWithCompanyId_Authorized_ReturnsOk()
        {
          
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };

       
            var loginResponse = await _client.SendAsync(loginRequest);
            loginResponse.EnsureSuccessStatusCode();

       
            var loginContent = await loginResponse.Content.ReadAsStringAsync();
            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            
            var companyId = 1; 
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/campaigns/company/{companyId}");

            request.Headers.Add("Authorization", $"Bearer {token}");

            
            var response = await _client.SendAsync(request);

            
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            
        }

        [Fact]
        public async Task TestCreateCampaign_Authorized_ReturnsCreated()
        {
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };

          
            var loginResponse = await _client.SendAsync(loginRequest);
            loginResponse.EnsureSuccessStatusCode();

       
            var loginContent = await loginResponse.Content.ReadAsStringAsync();
            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            var newCampaign = new Campaign
            {
                Name = "New Campaign",
                Description = "Description of the new campaign",
                CompanyId = 1, 
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(30)
            };
            var jsonContent = JsonSerializer.Serialize(newCampaign);
            var request = new HttpRequestMessage(HttpMethod.Post, "/api/campaigns")
            {
                Content = new StringContent(jsonContent, Encoding.UTF8, "application/json")
            };
            request.Headers.Add("Authorization", $"Bearer {token}");

           
            var response = await _client.SendAsync(request);

            
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            
        }


    }
}
