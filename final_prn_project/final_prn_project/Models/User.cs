using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace final_prn_project.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string userName { get; set; }
        public string? Gender { get; set; } = "Not Specified";
        public string? Address { get; set; } = "";
        public string? Description { get; set; } = "";
        public byte[] passwordHash { get; set; } = new byte[32];
        public byte[] passwordSalt { get; set; } = new byte[32];
        public string? verificationToken { get; set; }
        public DateTime? verifiedAt { get; set; }
        public string? passwordResetToken { get; set; }
        public DateTime? resetTokenExpires { get; set; }
        public bool isActive { get; set; } = true;

        [JsonIgnore]
        public virtual ICollection<UserRoleGroup> UserRoleGroups { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
        [JsonIgnore]
        public virtual ICollection<Group> Groups { get; set; }

        public User()
        {
            this.UserRoleGroups = new List<UserRoleGroup>();
            this.Tasks = new List<Task>();
            this.Groups = new List<Group>();
        }

    }
}
