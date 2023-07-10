using final_prn_project.Data;
using final_prn_project.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace final_prn_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly DataContext _context;

        public RoleController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("GetRoles")]
        public IActionResult GetRoles()
        {
            try
            {
                var roleDtoList = new List<RoleDTO>();
                var roles = _context.Roles.ToList();

                #region Add To RoleDTO list
                roles.ForEach(rl =>
                {
                    var role = new RoleDTO(rl);
                    roleDtoList.Add(role);
                });
                #endregion

                return Ok(roleDtoList);
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }


        }

        [HttpGet("GetUserRole")]
        public IActionResult GetUserRole(Guid userId, int groupId)
        {
            try
            {
                var roleDto = from urg in _context.UserRoleGroups
                              join r in _context.Roles
                              on urg.roleID equals r.ID
                              where urg.userID == userId && urg.groupID == groupId
                              select new RoleDTO { roleID = r.ID, roleName = r.Name };

                if (!roleDto.Any()) return NotFound("Role Not Found");

                return Ok(roleDto);
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }


        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserRole(Guid userId, int groupId, int roleId)
        {
            try
            {
                #region Check User Role Group Exist
                var userRoleGroup = _context.UserRoleGroups
                                    .Include(urg => urg.User)
                                    .FirstOrDefault(rg =>
                                    rg.userID == userId
                                    && rg.groupID == groupId);

                if (userRoleGroup == null) return NotFound("User or Group Not Found");
                #endregion
                #region Check Role Exist
                var role = _context.Roles.FirstOrDefault(r => r.ID == roleId);
                if (role == null) return NotFound("Role Not Found");
                #endregion

                userRoleGroup.roleID = roleId;
                _context.UserRoleGroups.Update(userRoleGroup);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserRoleGroupExists(userId, groupId, roleId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Ok($"Successfully Update {userRoleGroup.User.userName}'s Role to {role.Name}");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        private bool UserRoleGroupExists(Guid userId, int groupId, int roleId)
        {
            return _context.UserRoleGroups.Any(urg => urg.userID == userId && urg.groupID == groupId && urg.roleID == roleId);
        }
    }
}
