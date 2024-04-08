using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Dtos
{
    public class UpdateLocationStatusRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int LocationId { get; set; }
        [Required]
        public string? Status { get; set; }
    }
}
