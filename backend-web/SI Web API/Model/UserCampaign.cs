using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SI_Web_API.Model
{
    public class UserCampaign
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        [ForeignKey("Campaign")]
        public int CampaignId { get; set; }
        public string Status { get; set; }
        public string WorkingStatus { get; set; }
        [JsonIgnore]
        [ForeignKey("Location")]
        public int? LocationId {  get; set; }

        // Navigation properties
        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public Campaign Campaign { get; set; }
    }
}
