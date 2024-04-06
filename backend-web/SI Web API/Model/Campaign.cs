using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class Campaign
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("Company")]
        public int CompanyId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Navigation property
        [JsonIgnore]
        public Company Company { get; set; }
        [JsonIgnore]
        public ICollection<Location> Locations { get; set; }
        [JsonIgnore]
        public ICollection<UserCampaign> UserCampaigns { get; set; }
    }
}
