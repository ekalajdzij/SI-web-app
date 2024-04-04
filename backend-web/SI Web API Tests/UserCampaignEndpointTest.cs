using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace SI_Web_API_Tests
{
    public class UserCampaignEndpointTest : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public UserCampaignEndpointTest(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task TestAuthorizedCall_ValidToken_ReturnsOk()
        {
            // Arrange- Login
            var loginRequest = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent(
                    "{\"username\":\"test\",\"password\":\"test\"}",
                    Encoding.UTF8,
                    "application/json")
            };

            var loginResponse = await _client.SendAsync(loginRequest);
            loginResponse.EnsureSuccessStatusCode();

            var loginContent = await loginResponse.Content.ReadAsStringAsync();
            var tokenStartIndex = loginContent.IndexOf("token\":\"") + "token\":\"".Length;
            var tokenEndIndex = loginContent.IndexOf("\",\"", tokenStartIndex);
            var token = loginContent.Substring(tokenStartIndex, tokenEndIndex - tokenStartIndex);

            var authorizedRequest = new HttpRequestMessage(HttpMethod.Get, "/api/user/campaigns/1/active");
            authorizedRequest.Headers.Add("Authorization", $"Bearer {token}");

            
            var authorizedResponse = await _client.SendAsync(authorizedRequest);

            // Assert
            Assert.Equal(HttpStatusCode.OK, authorizedResponse.StatusCode);
        }
    }
}
