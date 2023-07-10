using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace final_prn_project.Models
{
    public class Group
    {
        [Key]
        [Required]
        public int ID { get; set; }
        [Required]
        public Guid userID { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime createAt { get; set; } = DateTime.Now;
        public bool isActive { get; set; } = true;

        [JsonIgnore]
        public virtual ICollection<UserRoleGroup> UserRoleGroups { get; set; }
        [JsonIgnore]
        public virtual ICollection<GroupTaskLabel> GroupTaskLabels { get; set; }
        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; }

        public Group()
        {
            this.UserRoleGroups = new List<UserRoleGroup>();
            this.GroupTaskLabels = new List<GroupTaskLabel>();
            this.Users = new List<User>();
        }
    }
}
