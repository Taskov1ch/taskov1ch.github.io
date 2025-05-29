import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { HashRouter } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AudioProvider>
        <App />
      </AudioProvider>
    </HashRouter>
  </React.StrictMode>
);
