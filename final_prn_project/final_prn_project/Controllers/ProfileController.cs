using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using final_prn_project.Data;
using final_prn_project.Models;
using final_prn_project.DTOs;

namespace final_prn_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly DataContext _context;

        public ProfileController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Profile/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProfile(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                #region Check User Exists
                if (user == null)
                {
                    return NotFound("User Not Found");
                }
                #endregion
                #region Select Groups User In
                List<GroupDTO> list = new List<GroupDTO>();

                var groups = _context.UserRoleGroups.Where(g => g.userID == user.Id).ToList();
                groups.ForEach(g =>
                {
                    var group = _context.Groups.Find(g.groupID);
                    if (group != null)
                    {
                        GroupDTO groupDto = new GroupDTO(group);
                        list.Add(groupDto);
                    }
                });
                #endregion

                return Ok(new
                {
                    ID = user.Id,
                    Email = user.Email,
                    Name = user.userName,
                    Gender = user.Gender,
                    Address = user.Address,
                    Description = user.Description,
                    GroupList = list
                });
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }


        }

        // PUT: api/Profile/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfile(Guid id, ProfileDTO profileDTO)
        {
            try
            {
                User user = await _context.Users.FindAsync(id);

                #region Check User Exist
                if (user == null) return NotFound("User Not Found");
                #endregion
                #region Update Profile
                user.userName = profileDTO.Name;
                user.Gender = profileDTO.Gender;
                user.Address = profileDTO.Address;
                user.Description = profileDTO.Description;

                _context.Users.Update(user);
                #endregion

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok(user);
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }

        }

        // DELETE: api/Profile/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                #region Check User Exist
                if (user == null)
                {
                    return NotFound();
                }
                #endregion
                user.isActive = false;
                _context.Users.Update(user);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Ok($"Successfully Delete Account!");
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }

        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
