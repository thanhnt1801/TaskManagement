using System.ComponentModel.DataAnnotations;

namespace final_prn_project.DTOs
{
    public class UserRegisterDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string ConfirmPassword { get; set; } = string.Empty ;
    }
}
