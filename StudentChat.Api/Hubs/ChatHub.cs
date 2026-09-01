using Microsoft.AspNetCore.SignalR;

namespace StudentChat.Api.Hubs
{
	// Hanterar realtidskommunikationen i chatten
	public class ChatHub : Hub
	{
		// Skickar ett meddelande till alla anslutna användare
		public async Task SendMessage(string user, string role, string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", user, role, message);
		}

		//skickar announcemnts bara för lärare
		public async Task SendAnnouncement (string user, string role, string message){ 
			if (role != "Teacher")
			{
				throw new HubException("Only teacher can send announcements!");
			}

			await Clients.All.SendAsync("ReceiveAnnouncement", user, role, message);
		}
	}
}