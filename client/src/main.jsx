import App from "./App.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
        <Toaster position="bottom-right" richColors expand={true} />
        <App />
    </React.StrictMode>
  </AuthProvider>
);
