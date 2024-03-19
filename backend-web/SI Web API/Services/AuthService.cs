using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SI_Web_API.Services
{
    public class AuthService
    {
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwtToken(string username)
        {
            // Token generation logic
            throw new NotImplementedException();
        }

        public string ValidateJwtToken(string username)
        {
            // Token validation logic
            throw new NotImplementedException();

        }
    }
}
