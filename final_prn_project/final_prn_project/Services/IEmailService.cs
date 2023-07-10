using final_prn_project.DTOs;
using System.Threading.Tasks;
using static final_prn_project.Services.EmailService;

namespace final_prn_project.Services
{
    public interface IEmailService
    {
        Task SendMail(MailContent mailContent);
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}