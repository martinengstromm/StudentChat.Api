import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import './App.css';

function App() {
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  const [user, setUser] = useState("");
  const [role, setRole] = useState("Student");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Skapar anslutningen till SignalR-hubben
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7100/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      // Tar emott meddelande från backend
      connection.on("ReceiveMessage", (user, role, message) => {
        setMessages((oldMessages) => [
          ...oldMessages,
          {user, role, message}
        ]);
    });

    // Tar emot announcements
    connection.on("ReceiveAnnouncement", (user, message) => {
      setAnnouncements((oldAnnouncements) => [
        ...oldAnnouncements,
        { user, message }
      ]);
    });
    
    // Startar anslutningen
      connection
        .start()
        .then(() => {
          setStatus("Connected");
        })
        .catch(() => {
          setStatus("Could not connect");
        });
    }
  }, [connection]);

  // Skickar meddelandet till backend
  const sendMessage = async () => {
    if (!user.trim() || !message.trim()) {
      return;
    }

    await connection.invoke("SendMessage", user, role, message);

    setMessage("");
  };

  //Skickar announcement
  const sendAnnouncement = async () => {
    if (!user.trim() || !announcement.trim()){
      return;
    }

    await connection.invoke(
      "SendAnnouncement",
      user,
      role,
      announcement
    );

    setAnnouncement("");
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1>School Chat</h1>
          <p>Status: {status}</p>
        </div>

        <div className="user-settings">
          <input
            type="text"
            placeholder="Your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Student">Student</option>
            <option value="Teacher">teacher</option>
          </select>
        </div>
      </div>
        
        <div className="chat-layout">

          <div className="general-chat">
            <h2>General Chat</h2>

            <div>
              {messages.map((msg, index) => (
                <p key={index}> <strong>{msg.user}:</strong> ({msg.role}): {msg.message}
                </p>
              ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            
              <button onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
          
        <div className="announcements">
          <h2>Announcements</h2>

          <div>
            {announcements.map((item, index) => (
              <p key={index}>
                <strong>{item.user}:</strong> {item.message}
              </p>
            ))}
          </div>    

          {role === "Teacher" && (
            <div className="announcement-input">
              <input
                type="text"
                placeholder="Write an announcement"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
    
              <button onClick={sendAnnouncement}>
                Publish
              </button>
            </div>
          )}

          {role === "Student" && (
            <p>Only teachers can publish announcements</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
