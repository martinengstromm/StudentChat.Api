import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import './App.css';

function App() {
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("Ansluter...");

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
    </div>
  );
}

export default App;
