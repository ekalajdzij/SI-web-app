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
    public class UserEndpointsTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public UserEndpointsTest(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task TestGetAllUsers_ValidRequest_ReturnsOk()
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

            // Act
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/user");
            request.Headers.Add("Authorization", $"Bearer {token}");
            var response = await _client.SendAsync(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

     


    }
}
