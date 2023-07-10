using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace final_prn_project.Models
{
    [Table("UserRoleGroup")]
    public class UserRoleGroup
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("User")]
        public Guid userID { get; set; }

        [ForeignKey("Role")]
        public int roleID { get; set; }

        [ForeignKey("Group")]
        public int groupID { get; set; }

        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
        public virtual Group Group { get; set; }
    }

}