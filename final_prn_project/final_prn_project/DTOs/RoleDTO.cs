using final_prn_project.Models;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class RoleDTO
    {
        [JsonConstructor]
        public RoleDTO()
        {
        }

        public RoleDTO(Role role)
        {
            roleID = role.ID;
            roleName = role.Name;
        }

        public int roleID { get; set; }
        public string roleName { get; set; }
    }
}
