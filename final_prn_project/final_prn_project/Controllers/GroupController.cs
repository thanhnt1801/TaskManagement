using final_prn_project.Data;
using final_prn_project.DTOs;
using final_prn_project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace final_prn_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly DataContext _context;

        public GroupController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var groups = _context.Groups
                .Include(groups => groups.UserRoleGroups)
                .Include(groups => groups.GroupTaskLabels)
                .Select(groups => groups);
            return Ok(groups);
        }

        [HttpGet("GetGroups")]
        public async Task<IActionResult> GetGroups(Guid userID)
        {
            var group = _context.Groups.Where(u => u.Users.Any(u => u.Id == userID));           
            return Ok(group);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            #region Check Group Exist
            Group group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.ID == id);

            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Select Users In Group
            var user = group.UserRoleGroups.Select(g => g.userID).ToList();
            var listUser = new List<User>();
            user.ForEach(g =>
            {
                var getUser = _context.Users.FirstOrDefault(l => l.Id == g);
                var list = _context.Users
                .Where(u => u.Id == g)
                .FirstOrDefault(u => u.Email == getUser.Email);
                listUser.Add(list);
            }
            );
            var listURG = new List<UserRoleGroup>();
            listUser.ForEach(u =>
            {
                var getURP = _context.UserRoleGroups.FirstOrDefault(r => r.userID == u.Id);
                listURG.Add(getURP);
            });
            var getUserName = await _context.Users.FirstOrDefaultAsync(u => u.Id == group.userID);
            #endregion

            return Ok(new
            {
                ID = group.ID,
                Name = group.Name,
                Description = group.Description,
                GroupCreatorID = group.userID,
                GroupCreatorName = getUserName.userName,
                listUser,
                listURG
            }); ;
        }

        [HttpGet("GetByGroupName")]
        public async Task<IActionResult> GetByClassName(string name)
        {
            #region Check Group Exist
            var group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.Name == name);

            if (group == null)
            {
                return BadRequest("group are not found!");
            }
            #endregion

            var user = group.UserRoleGroups.Select(g => g.userID);

            return Ok(new
            {
                ID = group.ID,
                Name = group.Name,
                GroupCreatorID = group.userID,
                User = user
            });
        }

        [HttpPost]
        public async Task<IActionResult> Post(GroupDTO dto) 
        {
            #region Check User Exist
            var user = _context.Users.FirstOrDefault(u => u.Id == dto.userID);
            if(user == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Create New Group
            Group group = new Group()
            {
                ID = 0,
                Name = dto.Name,
                userID = dto.userID,
                Description = dto.Description,
            };

            group.UserRoleGroups.Add(new UserRoleGroup
            {
                ID = 0,
                groupID = group.ID,
                userID = dto.userID,
                roleID = 1
            });

            _context.Add(group);
            user.Groups.Add(group);
            await _context.SaveChangesAsync();
            #endregion

            return Ok(new
            {
                ID = group.ID,
                Name = group.Name,
                GroupCreatorID = group.userID,
                GroupCreatorName = user.userName,
                Description = group.Description,
            });
        }

        [HttpPut]
        public async Task<IActionResult> Update(GroupDTO dto, int id)
        {
            #region Check Group Exist
            Group group = await _context.Groups.FindAsync(id);
            if(group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Update Group
            group.Name = dto.Name;
            group.Description = dto.Description;
            _context.Groups.Update(group);
            await _context.SaveChangesAsync();
            #endregion

            return Ok(new GroupDTO(group));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, Guid currentUserID)
        {
            #region Check Group Exist
            Group group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.ID == id);

            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Check Currnet User Exist
            var currentUser = await _context.Users
                .Include(user => user.Groups)
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Id == currentUserID);
            if (currentUser == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check User In Group Or Not
            var checkCurrentUserInGroup = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUser.Id);
            if (checkCurrentUserInGroup == null)
            {
                return BadRequest("User are not in group!");
            }
            #endregion
            #region Delete Group (Set Active = false)
            var currentUserRole = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUserID).roleID;
            if (currentUserRole == 1)
            {
                group.isActive = false;
                _context.Groups.Update(group);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest("You are not allow to delete group");
            }
            #endregion

            return Ok($"group {group.Name} has been deleted!");
        }

        [HttpDelete("DeleteByGroupName")]
        public async Task<IActionResult> DeleteByGroupName(string name, Guid currentUserID)
        {
            #region Check Group Exist
            Group group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.Name == name);

            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Check Currnet User Exist
            var currentUser = await _context.Users
                .Include(user => user.Groups)
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Id == currentUserID);
            if (currentUser == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check User In Group Or Not
            var checkCurrentUserInGroup = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUser.Id);
            if (checkCurrentUserInGroup == null)
            {
                return BadRequest("User are not in group!");
            }
            #endregion
            #region Delete Group (Set Active = false)
            var currentUserRole = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUserID).roleID;
            if (currentUserRole == 1)
            {
                group.isActive = false;
                _context.Groups.Update(group);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest("You are not allow to delete group");
            }
            #endregion

            return Ok($"{group.Name} has been deleted!");
        }

        [HttpPut("AddUser")]
        public async Task<IActionResult> AddUser(string email, string roleName, int groupID)
        {
            #region Check User Exist
            var user = await _context.Users
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Email == email);
            if(user == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check User is Verified Or Not
            if (user.verifiedAt == null)
            {
                return BadRequest("User are not verified!");
            }
            #endregion
            #region Check Assigned Role
            if (roleName != "Member" && roleName != "Guest")
            {
                return BadRequest("Role invalid!");
            }
            var role = await _context.Roles
                .Include(role => role.UserRoleGroups)
                .Include(role => role.Permissions)
                .FirstOrDefaultAsync(role => role.Name == roleName);
            if (role == null)
            {
                return BadRequest("Roles Not Found!");
            }
            #endregion
            #region Check Group Exist
            var group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.ID == groupID);
            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Check Duplicate User
            var checkDuplicateUser = group.UserRoleGroups.FirstOrDefault(group => group.userID == user.Id);
            if(checkDuplicateUser != null)
            {
                return BadRequest("This user is already in group!");
            }
            #endregion
            #region Add User To Group

            var userRoleGroup = new UserRoleGroup()
            {
                userID = user.Id,
                groupID = group.ID,
                roleID = role.ID
            };
            _context.Add(userRoleGroup);
            user.Groups.Add(group);
            await _context.SaveChangesAsync();
            #endregion region
            return Ok(new
            {
                GroupID = group.ID,
                GroupName = group.Name,
                UserID = user.Id,
                UserName = user.userName,
                RoleID = role.ID,
                RoleName = role.Name,
            });
        }

        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(Guid? id, int? groupID, Guid? currentUserID)
        {
            #region Check Null
            if (id == null)
            {
                return BadRequest("ID can not be null");
            }
            if (groupID == null)
            {
                return BadRequest("GroupID can not be null");
            }
            #endregion
            #region Check User Exist
            var user = await _context.Users
                .Include(user => user.Groups)
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Id == id);
            if (user == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check Currnet User Exist
            var currentUser = await _context.Users
                .Include(user => user.Groups)
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Id == currentUserID);
            if (currentUser == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check Group Exist
            var group = await _context.Groups
                .Include(group => group.Users)
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.ID == groupID);
            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Check User In Group Or Not
            var checkUserInGroup = group.UserRoleGroups.FirstOrDefault(u => u.userID == user.Id);
            if (checkUserInGroup == null)
            {
                return BadRequest("User are not in group!");
            }
            var checkCurrentUserInGroup = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUser.Id);
            if (checkCurrentUserInGroup == null)
            {
                return BadRequest("User are not in group!");
            }
            #endregion

            #region Check Role To Delete
            var currentUserRole = group.UserRoleGroups.FirstOrDefault(u => u.userID == currentUserID).roleID;
            var userRole = group.UserRoleGroups.FirstOrDefault(u => u.userID == id).roleID;
            if (currentUserRole == 1)
            {
                group.UserRoleGroups.Remove(checkUserInGroup);
                group.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            else if (currentUserRole == 2 && userRole > 2)
            {
                group.UserRoleGroups.Remove(checkUserInGroup);
                group.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest("You are not allow to delete this user");
            }
            #endregion
            return Ok($"User {user.userName} are successfully remove!");
        }

        [HttpDelete("LeaveGroup")]
        public async Task<IActionResult> LeaveGroup(int groupID, Guid userID)
        {
            #region Check Group Exist
            Group group = await _context.Groups
                .Include(group => group.UserRoleGroups)
                .Include(group => group.GroupTaskLabels)
                .SingleOrDefaultAsync(group => group.ID == groupID);
            if (group == null)
            {
                return BadRequest("Group Not Found!");
            }
            #endregion
            #region Check User Exist
            var user = await _context.Users
                .Include(user => user.Groups)
                .Include(user => user.UserRoleGroups)
                .Include(user => user.Tasks)
                .FirstOrDefaultAsync(user => user.Id == userID);
            if (user == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check User In Group Or Not
            var checkUserInGroup = group.UserRoleGroups.FirstOrDefault(u => u.userID == user.Id);
            if (checkUserInGroup == null)
            {
                return BadRequest("User are not in group!");
            }
            #endregion
            #region Leave Group
            var userRole = group.UserRoleGroups.FirstOrDefault(u => u.userID == userID).roleID;
            if (userRole == 1)
            {
                return BadRequest("You can't leave the group because you're the owner");
            }
            group.UserRoleGroups.Remove(checkUserInGroup);
            group.Users.Remove(user);
            await _context.SaveChangesAsync();
            #endregion
            return Ok($"You have been left group {group.Name}");
        }
    }

    
}
