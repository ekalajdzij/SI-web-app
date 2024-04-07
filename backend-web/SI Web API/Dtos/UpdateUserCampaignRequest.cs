using System.ComponentModel.DataAnnotations;
namespace SI_Web_API.Dtos
{
    public class UpdateUserCampaignRequest
    {
        [Required]
        public int? UserId { get; set; }
        [Required]
        public int? CampaignId { get; set; }
        [Required]
        public string? Status { get; set; }
        public string? WorkingStatus { get; set; }
    }
}
