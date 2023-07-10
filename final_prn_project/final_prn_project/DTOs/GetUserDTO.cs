using final_prn_project.Models;
using System;
using System.Text.Json.Serialization;

namespace final_prn_project.DTOs
{
    public class GetUserDTO
    {
        [JsonConstructor]
        public GetUserDTO()
        {
        }

        public GetUserDTO(User user)
        {
            ID = user.Id;
            Name = user.userName;
            UserRoleGroup = (UserRoleGroup)user.UserRoleGroups;
        }

        public Guid ID { get; set; }
        public string Name { get; set; }
        public UserRoleGroup UserRoleGroup { get; set; }

    }
}
