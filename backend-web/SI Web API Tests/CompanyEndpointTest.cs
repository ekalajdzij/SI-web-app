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
    public class CompanyEndpointTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;
        public CompanyEndpointTest(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }
        [Fact]
        public async Task TestLoginAndAuthorizedCall_ValidCredentials_ReturnsOk()
        {
            
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };
            
            var loginResponse = await _client.SendAsync(loginRequest);
            var loginContent = await loginResponse.Content.ReadAsStringAsync();

            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            var authorizedRequest = new HttpRequestMessage(HttpMethod.Get, "/api/company/1");
            authorizedRequest.Headers.Add("Authorization", $"Bearer {token}");

            var authorizedResponse = await _client.SendAsync(authorizedRequest);

            Assert.Equal(HttpStatusCode.OK, authorizedResponse.StatusCode);
        }

        [Fact]
        public async Task TestCompanyEndpoint_GetCompanyById_Authorized_ReturnsOk()
        {
        
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };
            var loginResponse = await _client.SendAsync(loginRequest);
            var loginContent = await loginResponse.Content.ReadAsStringAsync();

            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            
            var authorizedRequest = new HttpRequestMessage(HttpMethod.Get, "/api/company/1");
           
            authorizedRequest.Headers.Add("Authorization", $"Bearer {token}");

            
            var authorizedResponse = await _client.SendAsync(authorizedRequest);

            
            Assert.Equal(HttpStatusCode.OK, authorizedResponse.StatusCode);
            
        }

        [Fact]
        public async Task TestCompanyEndpoint_UpdateCompanyName_Authorized_ReturnsOk()
        {
            // Arrange - Login
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };
            var loginResponse = await _client.SendAsync(loginRequest);
            var loginContent = await loginResponse.Content.ReadAsStringAsync();

            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

           
            int companyIdToUpdate = 1; 
            string newName = "Kompanijaaaaaaaaaa";
            
            var updateRequest = new HttpRequestMessage(HttpMethod.Put, $"/api/company/{companyIdToUpdate}")
            {
                Content = new StringContent($"\"{newName}\"", Encoding.UTF8, "application/json")
            };
            updateRequest.Headers.Add("Authorization", $"Bearer {token}");

            var updateResponse = await _client.SendAsync(updateRequest);

            Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

            
        }

    }

}
