using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Collections;
using Microsoft.AspNet.SignalR;
namespace WebApplication1
{
    public class ChatHub : Hub
    {
        public void Send(object o)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(o);
        }

    }
}