using final_prn_project.Data;
using final_prn_project.DTOs;
using final_prn_project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using static final_prn_project.Services.EmailService;

namespace final_prn_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUserServices _services;
        private readonly IEmailService _emailService;

        public LoginController(DataContext context, IConfiguration configuration, IUserServices services, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _services = services;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO userLoginDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLoginDTO.Email);
            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            if (!VerifyPasswordHash(userLoginDTO.Password, user.passwordHash, user.passwordSalt))
            {
                return BadRequest("Password is incorrect!");
            }

            if (user.verifiedAt == null)
            {
                return BadRequest("Not verified!"); 
            }

            return Ok(user);
        }

        

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            user.passwordResetToken = _services.CreateRandomToken(email);
            user.resetTokenExpires = DateTime.Now.AddDays(1);
            await _context.SaveChangesAsync();

            #region Add Email Template
            var builder = new BodyBuilder();
            //Giao thuc IO Truyen file
            using (StreamReader SourceReader = System.IO.File.OpenText(@"D:\Study\LearnReact_0\PRN221_Project_Group5\prn221project-csharp(0)\final_prn_project\final_prn_project\Template\verificationTemplate.html"))
            {
                builder.HtmlBody = SourceReader.ReadToEnd();

            }

            // replace chữ trong indexs
            string htmlBody = builder.HtmlBody.Replace("Welcome!", "Reset Password Request")
                .Replace("We're excited to have you get started. First, you need to confirm your account.", "We have received the request to reset your password")
                .Replace("verification", "reset password")
                .Replace("Token", user.passwordResetToken);
            string messagebody = string.Format("cid:{0}", htmlBody);

            #endregion

            var mailContent = new MailContent();
            mailContent.To = "hank29@ethereal.email"; //temp email
            mailContent.Subject = "Reset password request!";
            mailContent.Body = messagebody;

            await _emailService.SendMail(mailContent);


            return Ok("You may now can reset your password!");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO resetPasswordDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.passwordResetToken == resetPasswordDTO.Token);
            if (user == null || user.resetTokenExpires < DateTime.Now)
            {
                return BadRequest("Invalid Token.");
            }
            var password = resetPasswordDTO.Password;
            var confirmPassword = resetPasswordDTO.ConfirmPassword;
            if (password != confirmPassword)
            {
                return BadRequest("Password must match!");
            }
            if (password.Length < 6)
            {
                return BadRequest("Please enter at least 6 characters");
            }
            _services.CreatePasswordHash(resetPasswordDTO.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.passwordHash = passwordHash;
            user.passwordSalt = passwordSalt;
            user.passwordResetToken = null;
            user.resetTokenExpires = null;

            await _context.SaveChangesAsync();

            return Ok("Password successfully reset.");
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computeHash.SequenceEqual(passwordHash);
            }

        }
    }
}
