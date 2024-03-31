using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public string Mail { get; set; }

        [ForeignKey("Company")]
        public int CompanyId { get; set; }
        [NotMapped]
        public string Token { get; set; }
        public string SecretKey { get; set; }

        // Navigation property
        [JsonIgnore]
        public Company Company { get; set; }
        [JsonIgnore]
        public ICollection<UserCampaign> UserCampaigns { get; set; }

    }
}
