namespace SignalRDemo.App.Hubs
{
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.SignalR;

    public interface IChatClient
    {
        Task MessageReceived(string message);

        Task MoveReceived(int x, int y);
    }

    public class ChatHub : Hub<IChatClient>
    {
        public Task SendMessage(string message)
        {
            return this.Clients.Others.MessageReceived(message);
        }

        public Task SendMove(int x, int y)
        {
            return this.Clients.Others.MoveReceived(x, y);
        }
    }
}
