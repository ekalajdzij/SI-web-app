using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
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
        public DbSet<SI_Web_API.Model.Admin> Admin { get; set; } = default!;
        public DbSet<SI_Web_API.Model.Campaign> Campaign { get; set; } = default!;
        public DbSet<SI_Web_API.Model.Company> Company { get; set; } = default!;
        public DbSet<SI_Web_API.Model.Location> Location { get; set; } = default!;
        public DbSet<SI_Web_API.Model.User> User { get; set; } = default!;
        public DbSet<SI_Web_API.Model.UserCampaign> UserCampaign { get; set; } = default!;
        public DbSet<SI_Web_API.Model.Record> Record{ get; set; } = default!;
    }
}
