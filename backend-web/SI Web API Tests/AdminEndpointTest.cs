using Microsoft.AspNetCore.Mvc.Testing;
using SI_Web_API.Model;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace SI_Web_API_Tests
{
    public class AdminEndpointTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AdminEndpointTest(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task TestGetAllAdmins_Authorized_ReturnsOk()
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

         
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/admin");

            request.Headers.Add("Authorization", $"Bearer {token}");

           
            var response = await _client.SendAsync(request);

           
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

           
        }

        [Fact]
        public async Task TestGetAdminById_Authorized_ReturnsOk()
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

            var adminId = 1; 
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/admin/{adminId}");

            request.Headers.Add("Authorization", $"Bearer {token}");

            
            var response = await _client.SendAsync(request);

      
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);


        }
       
    }
}
