using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SI_Web_API.Model;

namespace SI_Web_API.Data
{
    public class SI_Web_APIContext : DbContext
    {
        public SI_Web_APIContext (DbContextOptions<SI_Web_APIContext> options)
            : base(options)
        {
        }

        public DbSet<SI_Web_API.Model.DesignatedLocation> DesignatedLocation { get; set; } = default!;
        public DbSet<SI_Web_API.Model.User> User { get; set; } = default!;
    }
}
