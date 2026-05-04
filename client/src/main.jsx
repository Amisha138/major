import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          gutter={14}
          toastOptions={{
            duration: 3500,
            className:
              "!rounded-[1.25rem] !border-2 !border-[#1A1A1A] !bg-white !px-4 !py-3 !text-sm !text-[#1A1A1A] !shadow-[4px_4px_0_0_#1A1A1A]",
            success: {
              iconTheme: {
                primary: "#2DD4BF",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#F87171",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
