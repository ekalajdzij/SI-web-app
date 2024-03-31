using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SI_Web_API.Model
{
    public class Location
    {
        [Key]
        public int Id { get; set; }
        public string TypeOfLocation { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string Description { get; set; }

        [ForeignKey("Campaign")]
        public int CampaignId { get; set; }
        [ForeignKey("User")]
        public int? UserId { get; set; }

        // Navigation property
        public Campaign Campaign { get; set; }
        public ICollection<UserCampaign> UserCampaigns { get; set; }
    }
}
