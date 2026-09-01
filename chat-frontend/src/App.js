import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import './App.css';
import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";

function App() {
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
      connection.on("ReceiveMessage", (user, message) => {
        setMessages((oldMessages) => [
          ...oldMessages,
          {user, message}
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

  return (
    <div>
      <h1>Student Chat</h1>
      <p>Status: {status}</p>

      <input
        type="text"
        placeholder="Your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />


      <div>
        {messages.map((msg, index) => (
          <p key={index}> <strong>{msg.user}:</strong> {msg.message}
          </p>
        ))}
      </div>

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
  );
}

export default App;
