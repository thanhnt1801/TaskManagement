using final_prn_project.Data;
using final_prn_project.DTOs;
using final_prn_project.Models;
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
    public class RegisterController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IUserServices _services;

        public RegisterController(DataContext context, IConfiguration configuration, IEmailService emailService, IUserServices services)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _services = services;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO userRegisterDTO)
        {
            
            if (_context.Users.Any(u => u.Email == userRegisterDTO.Email))
            {
                return BadRequest("User Already Exist!");
            }
            var password = userRegisterDTO.Password;
            var confirmPassword = userRegisterDTO.ConfirmPassword;
            if (password != confirmPassword)
            {
                return BadRequest("Password must match!");
            }
            if (password.Length < 6)
            {
                return BadRequest("Please enter at least 6 characters");
            }


            _services.CreatePasswordHash(userRegisterDTO.Password,
                 out byte[] passwordHash,
                 out byte[] passwordSalt);

            var user = new User
            {
                Email = userRegisterDTO.Email,
                userName = userRegisterDTO.UserName,
                passwordHash = passwordHash,
                passwordSalt = passwordSalt,
                verificationToken = _services.CreateRandomToken(userRegisterDTO.Email)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            #region Add Email Template
            var builder = new BodyBuilder();
            //Giao thuc IO Truyen file
            using (StreamReader SourceReader = System.IO.File.OpenText(@"D:\Study\LearnReact_0\PRN221_Project_Group5\prn221project-csharp(0)\final_prn_project\final_prn_project\Template\verificationTemplate.html"))
            {
                builder.HtmlBody = SourceReader.ReadToEnd();
                
            }
  
            // replace chữ trong indexs
            string htmlBody = builder.HtmlBody.Replace("Welcome!", $"Welcome {user.userName}!")
            .Replace("Token", user.verificationToken);
            string messagebody = string.Format("cid:{0}", htmlBody);

            #endregion
            #region Send Verification Mail To User
            var mailContent1 = new MailContent();
            mailContent1.To = "fepepov776@kixotic.com"; //temp email
            mailContent1.Subject = "Welcome To Task Tracking!";
            mailContent1.Body = messagebody;
             await _emailService.SendMail(mailContent1);
            #endregion
            return Ok("User successfully created!");
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.verificationToken == token);
            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            user.verifiedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok($"User {user.userName} verified at {user.verifiedAt}!");
        }
    }
}
