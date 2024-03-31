using System.ComponentModel.DataAnnotations;
namespace SI_Web_API.Dtos
{
    public class UpdateRequest
    {
        [Required]
        public int? UserId { get; set; }
        [Required]
        public int? CampaignId { get; set; }
        [Required]
        public string? Status { get; set; }
    }
}
