using System;
using System.Threading.Tasks;

namespace final_prn_project.Hubs.Clients
{
    public interface INotificationClient
    {
        Task RecieveNotificationResult(string message);

        Task RecieveUserIDResult(Guid id);
    }
    
}
