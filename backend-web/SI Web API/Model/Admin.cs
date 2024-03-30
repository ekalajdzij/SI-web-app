using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace SI_Web_API.Model
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string SecretKey { get; set; }
        public bool IsSuperAdmin { get; set; }
        [ForeignKey("Company")]
        public int? CompanyId { get; set; } // Nullable

        // Navigation property
        [JsonIgnore]
        public Company Company { get; set; }
    }
}
