using Microsoft.AspNetCore.SignalR;

namespace StudentChat.Api.Hubs
{
	// Hanterar realtidskommunikationen i chatten
	public class ChatHub : Hub
	{
		// Skickar ett meddelande till alla anslutna användare
		public async Task SendMessage(string user, string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", user, message);
		}
	}
}