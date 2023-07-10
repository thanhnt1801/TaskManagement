using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("Role")]
    public class Role
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }

        public virtual ICollection<UserRoleGroup> UserRoleGroups { get; set; }
        public virtual ICollection<Permission> Permissions { get; set; }

        public Role()
        {
            this.UserRoleGroups = new List<UserRoleGroup>();
            this.Permissions = new List<Permission>();
        }
    }

}
