using final_prn_project.Data;
using final_prn_project.DTOs;
using final_prn_project.Models;
using final_prn_project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static final_prn_project.Services.EmailService;

namespace final_prn_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IEmailService _emailService;

        public TaskController(DataContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var tasks = _context.Tasks
                .Include(tasks => tasks.GroupTaskLabels)
                .Select(tasks => tasks);

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            #region Check Task Exist
            var task = await _context.Tasks
                .Include(tasks => tasks.GroupTaskLabels)
                .Include(tasks => tasks.Priority)
                .Include(tasks => tasks.Status)
                .SingleOrDefaultAsync(task => task.ID == id);

            if (task == null)
            {
                return BadRequest("Task Not Found!");
            }
            var GTL = task.GroupTaskLabels.FirstOrDefault(t => t.taskID == id);
            if (GTL == null)
            {
                return BadRequest("Task Not Found");
            }
            #endregion

            #region Check Group Exist
            var group = await _context.Groups.Include(g => g.UserRoleGroups).FirstOrDefaultAsync(g => g.ID == GTL.groupID);
            if (group == null)
            {
                return BadRequest("Group Not Found");
            }
            #endregion

            #region Get Users List
            var listUser = new List<User>();
            var user = group.UserRoleGroups.Select(g => g.userID).ToList();
            user.ForEach(g =>
            {
                var getUser = _context.Users.FirstOrDefault(l => l.Id == g);
                getUser.UserRoleGroups = null;
                var list = _context.Users
                .Where(u => u.Id == g)
                .FirstOrDefault(u => u.Email == getUser.Email);

                list.UserRoleGroups = null;
                listUser.Add(list);
            });
            if (user == null)
            {
                return BadRequest("User Not Found");
            }
            #endregion
            var getAssignTo = _context.Users.Find(task.assignTo);
            return Ok(new
            {
                TaskName = task.Name,
                AssignToUserID = task.assignTo,
                AssignToUserName = getAssignTo.userName,
                ListAssignTo = listUser.Where(l => l.Id != task.assignTo).Select(l => new
                {
                    l.Id, l.userName
                }),
                Priority = task.priorityID,
                DueDate = task.dueDate,
                Description = task.Description,
                Attachment = task.Attachment,
                GroupID = GTL.groupID
            });
        }

        [HttpGet("GetUserTask")]
        public async Task<IActionResult> GetUserTask(Guid userID)
        {
            #region Check User Exist
            var user = await _context.Users.Include(u => u.UserRoleGroups).FirstOrDefaultAsync(u => u.Id == userID);
            if (user == null)
            {
                return BadRequest("User Not Found");
            }
            #endregion

            #region Get Task List In Group
            var task = _context.Tasks
                .Include(t => t.User).Include(t => t.GroupTaskLabels).Where(t => t.assignTo == userID)
                .OrderBy(t => t.dueDate)
                .Select(t => new
                {
                    t.ID,
                    t.Name,
                    t.createdAt,
                    t.priorityID,
                    t.dueDate,
                    group = t.GroupTaskLabels.Select(t => t.groupID),
                }).ToList();
            #endregion
            return Ok(new
            {
                task
            });

        }

        [HttpGet("GetTaskInGroup")]
        public async Task<IActionResult> GetTaskInGroup(int groupID)
        {

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


            var task = group.GroupTaskLabels.Where(g => g.groupID == groupID).Select(g => new
            {
                g.taskID,
                g.labelID
            }).ToList();
            var listTask = new List<Models.Task>();
            task.ForEach(t =>
            {
                var getTask = _context.Tasks.FirstOrDefault(l => l.ID == t.taskID);
                var list = _context.Tasks
                .Where(l => l.ID == t.taskID)
                .FirstOrDefault(l => l.Name == getTask.Name);
                listTask.Add(list);
            });

            var label = group.GroupTaskLabels.Where(l => l.groupID == groupID && l.labelID != null).Select(l => l.labelID).ToList();
            var listLabel = new List<Models.Label>();
            label.ForEach(l =>
            {
                var getLabel = _context.Labels.FirstOrDefault(gl => gl.ID == l);
                var list = _context.Labels.Where(gl => gl.ID == l).FirstOrDefault(gl => gl.ID == getLabel.ID);
                listLabel.Add(list);
            });

            #region Get Users List
            var listUser = new List<User>();
            var user = group.UserRoleGroups.Select(g => g.userID).ToList();
            user.ForEach(g =>
            {
                var getUser = _context.Users.FirstOrDefault(l => l.Id == g);
                getUser.UserRoleGroups = null;
                var list = _context.Users
                .Where(u => u.Id == g)
                .FirstOrDefault(u => u.Email == getUser.Email);

                list.UserRoleGroups = null;
                listUser.Add(list);
            });
            if (user == null)
            {
                return BadRequest("User Not Found");
            }
            #endregion

            return Ok(new
            {
                ListTasks = listTask.Select(lt => new
                {
                    lt.ID,
                    lt.Name,
                    lt.priorityID,
                    lt.dueDate,
                    lt.createdAt,
                    lt.isActive,
                    Enumerable = lt.GroupTaskLabels.Where(t => t.groupID == groupID).Select(t => t.labelID)
                }),
                AssignTo = listUser.Select(l => new
                {   
                    l.Id,
                    l.userName,
                })
            });
        }

        [HttpGet("GetLabelsInGroup")]
        public async Task<IActionResult> GetLabelsInGroup(int groupID)
        {
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
            var label = _context.Labels.Where(g => g.groupID == groupID).Select(g => g.ID).ToList();
            var listLabel = new List<Label>();
            label.ForEach( g =>
            {
                var getLabel =  _context.Labels.FirstOrDefault(l => l.ID == g);
                var list =  _context.Labels
                .Where(l => l.ID == g)
                .FirstOrDefault(l => l.Name == getLabel.Name);
                listLabel.Add(list);
            }); 
            return Ok(listLabel);
        }

        [HttpGet("FilterTaskByLabel")]
        public async Task<IActionResult> FilterTaskByLabel(string labelName, int groupID)
        {
            var label = await _context.Labels.Include(l => l.GroupTaskLabels).FirstOrDefaultAsync(l => l.Name == labelName);
            if (label == null)
            {
                return BadRequest("Label Not Found");
            }

            var group = await _context.Groups.FirstOrDefaultAsync(g => g.ID == groupID);
            if (group == null)
            {
                return BadRequest("Group Not Found");
            }
            #region Check Label In Group
            var checkLabelInGroup = group.GroupTaskLabels.FirstOrDefault(c => c.labelID == label.ID);
            if (checkLabelInGroup == null)
            {
                return BadRequest("Label Not Found");
            }
            #endregion
            #region Search Task By Label
            var task = label.GroupTaskLabels.Where(l => l.labelID == label.ID).Select(l => l.taskID);
            #endregion


            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(TaskDTO dto, int groupID)
        {
            #region Check The User Who Is Assigned To
            var checkAssignTo = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.assignTo);
            if (checkAssignTo == null)
            {
                return BadRequest("User Not Found");
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
            #region Check User In Group Or Not
            var checkUserInGroup = group.UserRoleGroups.FirstOrDefault(group => group.userID == dto.assignTo);
            if (checkUserInGroup == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Create Task
            Models.Task task = new Models.Task()
            {
                ID = 0,
                Name = dto.Name,
                taskCreator = dto.taskCreator,
                assignTo = dto.assignTo,
                dueDate = dto.dueDate,
                priorityID = dto.priorityID,
                Description = dto.Description,
                Attachment = dto.Attachment
            };

            task.GroupTaskLabels.Add(new GroupTaskLabel
            {
                groupID = groupID,
                taskID = task.ID,
            });
            _context.Add(task);
            await _context.SaveChangesAsync();
            #endregion
            var assignToUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.assignTo);
            var taskCreatorName = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.taskCreator);


            #region Add Email Template
            var builder = new BodyBuilder();
            //Giao thuc IO Truyen file
            using (StreamReader SourceReader = System.IO.File.OpenText(@"D:\Study\LearnReact_0\PRN221_Project_Group5\prn221project-csharp(0)\final_prn_project\final_prn_project\Template\verificationTemplate.html"))
            {
                builder.HtmlBody = SourceReader.ReadToEnd();

            }

            // replace chữ trong indexs
            var duedate = task.dueDate;
            string htmlBody = builder.HtmlBody.Replace("Welcome!", "New Task Has Coming")
            .Replace("We're excited to have you get started. First, you need to confirm your account.", "A new task has been assigned to you, please check below")
            .Replace("Please copy and paste the following token to the verification page.", $"Your task in group {group.Name}, time ends on :")
            .Replace("Token", duedate.ToString());

            string messagebody = string.Format("cid:{0}", htmlBody);

            #endregion

            #region Send Mail To User
            var mailContent1 = new MailContent();
            mailContent1.To = assignToUser.Email; //temp email
            /* mailContent1.To = "hank29@ethereal.email";*/
            mailContent1.Subject = "New Tasks Have Been Assigned To You";
            mailContent1.Body = messagebody;

            await _emailService.SendMail(mailContent1);
            #endregion
            return Ok(new
            {
                ID = task.ID,
                Name = task.Name,
                TaskCreator = task.taskCreator,
                TaskCreatorName = taskCreatorName.userName,
                AssignTo = task.assignTo,
                AssignToUser = assignToUser.userName,
                DueDate = task.dueDate,
                PriorityID = task.priorityID,
                Description = task.Description,
                Attachment = task.Attachment
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateTaskDTO dto, int taskID, Guid currentUserID, int groupID)
        {
            #region Check The User Who Is Assigned To
            var checkAssignTo = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.assignTo);
            if (checkAssignTo == null)
            {
                return BadRequest("User Not Found");
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
            #region Check User In Group Or Not
            var checkUserInGroup = group.UserRoleGroups.FirstOrDefault(group => group.userID == dto.assignTo);
            if (checkUserInGroup == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check Current UserID Exist
            var checkCurrentUserIDExist = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserID);
            if (checkCurrentUserIDExist == null)
            {
                return BadRequest("User Not Found");
            }
            var checkCurrentUserIDInGroup = group.UserRoleGroups.FirstOrDefault(g => g.userID == currentUserID);
            if (checkCurrentUserIDInGroup == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Check Task Exist
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskID);
            if (task == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Check Task In Group
            var checkTaskInGroup = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID);
            if (checkTaskInGroup == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Update Data
            task.Name = dto.Name;
            task.assignTo = dto.assignTo;
            task.dueDate = dto.dueDate;
            task.priorityID = dto.priorityID;
            task.statusID = dto.statusID;
            task.Description = dto.Description;
            task.Attachment = dto.Attachment;
            task.lastModifiedAt = dto.lastModifiedAt;
            task.lastModifiedBy = currentUserID;
            _context.Update(task);
            await _context.SaveChangesAsync();
            #endregion

            return Ok(new UpdateTaskDTO(task));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id, int groupID, Guid currentUserID)
        {
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
            #region Check Task Exist
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == id);
            if (task == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Check Task In Group
            var checkTaskInGroup = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID);
            if (checkTaskInGroup == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Check Current UserID Exist
            var checkCurrentUserIDExist = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserID);
            if (checkCurrentUserIDExist == null)
            {
                return BadRequest("User Not Found");
            }
            var checkCurrentUserIDInGroup = group.UserRoleGroups.FirstOrDefault(g => g.userID == currentUserID);
            if (checkCurrentUserIDInGroup == null)
            {
                return BadRequest("User Not Found!");
            }
            #endregion
            #region Delete Task (Set Active = false)
            task.isActive = false;
            task.deletedBy = currentUserID;
            task.deletedAt = DateTime.Now;
            _context.Update(task);
            await _context.SaveChangesAsync();
            #endregion

            return Ok("Task Deleted Successfully");
        }

        [HttpPost("CreateLabel")]
        public async Task<ActionResult> CreateLabelAsync(LabelDTO dto, int taskID, int groupID)
        {
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
            #region Check Task Exist
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskID);
            if (task == null)
            {
                return BadRequest("Task Not Found");
            }
            #endregion
            #region Check Task In Group
            var checkTaskInGroup = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID);
            if (checkTaskInGroup == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Check Label Exist
            var checkDuplicate = await _context.Labels.FirstOrDefaultAsync(l => l.Name == dto.Name);
            if (checkDuplicate != null)
            {
                var checkLabelInGroup = group.GroupTaskLabels.FirstOrDefault(g => g.labelID == checkDuplicate.ID);
                if (checkLabelInGroup != null)
                {
                    return BadRequest("Label already exist, please try again!");
                }
            }
            #endregion
            var checkDuplicateName = await _context.Labels.Where(g => g.groupID == groupID).FirstOrDefaultAsync(g => g.Name == dto.Name);
            if(checkDuplicateName != null)
            {
                if(checkDuplicateName.groupID == groupID)
                {
                    return BadRequest("Label already exist, please try again!");
                }
            }

            #region Create New Label
            Label label = new Label()
            {
                ID = 0,
                Name = dto.Name,
                Description = dto.Description,
                groupID = groupID,
            };
            _context.Add(label);
            await _context.SaveChangesAsync();

            #endregion
            return Ok($"Label {label.Name} successfull created");
        }

        [HttpPut("UpdateLabel")]
        public async Task<ActionResult> UpdateLabelAsync(LabelDTO dto, int labelID)
        {
            #region Check Label Exist
            var label = await _context.Labels.FirstOrDefaultAsync(l => l.ID == labelID);
            if (label == null)
            {
                return BadRequest("Label Not Found");
            }
            #endregion
            #region Update Label
            label.Name = dto.Name;
            label.Description = dto.Description;
            _context.Update(label);
            await _context.SaveChangesAsync();
            #endregion

            return Ok(label);
        }

        [HttpDelete("DeleteLabel")]
        public async Task<ActionResult> DeleteLabelAsync(int labelID)
        {
            var checkLabelExist = await _context.Labels.Include(l => l.GroupTaskLabels).FirstOrDefaultAsync(l => l.ID == labelID);
            if (checkLabelExist == null)
            {
                return BadRequest("Label Not Found");
            }
            #region Delete Label (Set Active = false)
            _context.Remove(checkLabelExist);
            await _context.SaveChangesAsync();
            #endregion

            return Ok($"Deleted {checkLabelExist.Name} successfully!");
        }

        [HttpPut("AddLabel")]
        public async Task<ActionResult> AddLabelAsync(string labelName, int groupID, int taskID)
        {
            #region Check Label Exist
            var label = await _context.Labels.FirstOrDefaultAsync(l => l.Name == labelName);
            if (label == null)
            {
                return BadRequest("Label Not Found");
            }
            if (label.isActive == false)
            {
                return BadRequest("Label Not Found");
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
            #region Check Task Exist
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskID);
            if (task == null)
            {
                return BadRequest("Task Not Found");
            }
            #endregion
            #region Check Task In Task
            var checkTaskInTask = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID);
            if (checkTaskInTask == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Add Label
            var groupTaskLabel = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID && t.taskID == taskID);
            if (groupTaskLabel.labelID == null)
            {
                groupTaskLabel.labelID = label.ID;
                _context.Update(groupTaskLabel);
            }
            else
            {
                var gtl = new GroupTaskLabel()
                {
                    labelID = label.ID,
                    groupID = groupID,
                    taskID = taskID
                };
                _context.Add(gtl);
            }
            await _context.SaveChangesAsync();
            #endregion
            return Ok(new
            {
                LabelID = label.ID,
                GroupID = groupID,
                TaskID = taskID
            });
        }

        [HttpDelete("RemoveLabel")]
        public async Task<IActionResult> RemoveLabelAsync(int labelID, int groupID, int taskID)
        {
            #region Check Label Exist
            var label = await _context.Labels.FirstOrDefaultAsync(l => l.ID == labelID);
            if (label == null)
            {
                return BadRequest("Label Not Found");
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
            #region Check Task Exist
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.ID == taskID);
            if (task == null)
            {
                return BadRequest("Task Not Found");
            }
            #endregion
            #region Check Task In Group
            var checkTaskInGroup = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID);
            if (checkTaskInGroup == null)
            {
                return BadRequest("Task Not Found!");
            }
            #endregion
            #region Check Label In Group
            var checkLabelInTask = task.GroupTaskLabels.FirstOrDefault(c => c.labelID == labelID);
            if(checkLabelInTask == null)
            {
                return BadRequest("Label Not Found");
            }
            #endregion
            #region Remove Label
            var groupTaskLabel = task.GroupTaskLabels.FirstOrDefault(t => t.groupID == groupID && t.taskID == taskID);
            groupTaskLabel.labelID = null;
            _context.Update(groupTaskLabel);
            await _context.SaveChangesAsync();
            #endregion

            return Ok($"Label {label.Name} successfull deleted from {task.Name}");
        }
        
    }
}
