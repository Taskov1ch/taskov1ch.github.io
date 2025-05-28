import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext.jsx"; // <-- Импортируем провайдер

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AudioProvider>
        {" "}
        {/* <-- Оборачиваем App в провайдер */}
        <App />
      </AudioProvider>
    </BrowserRouter>
  </React.StrictMode>
);
