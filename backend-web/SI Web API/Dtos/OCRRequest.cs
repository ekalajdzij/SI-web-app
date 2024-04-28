using System.ComponentModel.DataAnnotations;

namespace SI_Web_API.Dtos
{
    public class OCRRequest
    {
        [Required]
        public String DestinationLanguage { get; set; }
        [Required]
        public IFormFile Image { get; set; }
    }
}
