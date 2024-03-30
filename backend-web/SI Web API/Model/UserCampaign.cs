using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SI_Web_API.Model
{
    public class UserCampaign
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        [ForeignKey("Campaign")]
        public int CampaignId { get; set; }
        public string Status { get; set; }

        // Navigation properties
        public User User { get; set; }
        public Campaign Campaign { get; set; }
    }
}
