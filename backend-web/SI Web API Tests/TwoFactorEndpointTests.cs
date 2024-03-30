using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Google.Authenticator;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using OtpNet;
using SI_Web_API.Controller;
using SI_Web_API.Data;
using SI_Web_API.Dtos;
using SI_Web_API.Model;
using SI_Web_API.Services;
using Xunit;

namespace SI_Web_API.Tests
{
    public class TwoFactorEndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public TwoFactorEndpointTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task TestTwoFactorSetupUserNotFound()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "/api/login/setup/2fa")
            {
                Content = new StringContent("{\"username\":\"string\",\"password\":\"string\"}", Encoding.UTF8, "application/json")
            };
            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
        [Fact]
        public async Task TestTwoFactorSetupOkResponse()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "/api/login/setup/2fa")
            {
                Content = new StringContent("{\"username\":\"test\",\"password\":\"test\"}", Encoding.UTF8, "application/json")
            };
            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        [Fact]
        public async Task TestTwoFactorAuthOkResponse()
        {
            var totp = new Totp(Encoding.UTF8.GetBytes("LMY2MHJMR565ZFLFYSND"));
            var code = totp.ComputeTotp(DateTime.UtcNow);
            var request = new HttpRequestMessage(HttpMethod.Post, $"/api/login/authenticate/2fa?code={code}")
            {
                Content = new StringContent("{\"username\":\"test2FA\",\"password\":\"test2FA\"}", Encoding.UTF8, "application/json")
            };


            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        [Fact]
        public async Task TestTwoFactorAuthBadResponse()
        {
            var totp = new Totp(Encoding.UTF8.GetBytes("badKey"));
            var code = totp.ComputeTotp(DateTime.UtcNow);
            var request = new HttpRequestMessage(HttpMethod.Post, $"/api/login/authenticate/2fa?code={code}")
            {
                Content = new StringContent("{\"username\":\"test2FA\",\"password\":\"test2FA\"}", Encoding.UTF8, "application/json")
            };

            var response = await _client.SendAsync(request);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
