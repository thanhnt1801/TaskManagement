using final_prn_project.Hubs.Clients;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace final_prn_project.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        public async Task SendNotificationResult(string result)
        {
            await Clients.All.RecieveNotificationResult(result);
        }

        public async System.Threading.Tasks.Task SendUserIDResult(Guid id)
        {
            await Clients.All.RecieveUserIDResult(id);
        }
    }
}
