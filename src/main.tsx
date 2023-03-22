import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth";
import "./index.css";
import { router } from "./lib/router";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProvideAuth>
        <RouterProvider router={router} />
      </ProvideAuth>
    </QueryClientProvider>
  </React.StrictMode>
);
