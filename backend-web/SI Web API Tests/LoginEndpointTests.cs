using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace SI_Web_API.Tests
{
    public class LoginEndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public LoginEndpointTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task TestLogin_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task TestLogin_InvalidCredentials_ReturnsNotFound()
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Post, "/api/login")
            {
                Content = new StringContent("{\"username\":\"nonexistent\",\"password\":\"invalid\"}", Encoding.UTF8, "application/json")
            };

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
