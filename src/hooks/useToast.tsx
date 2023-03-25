import * as ToastUI from "@radix-ui/react-toast";
import React from "react";
import { IoClose } from "react-icons/io5";

export type Toast = {
  type: "success" | "error" | "warning" | "info";
  message: string;
  id: string;
  title: string;
};
type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Exclude<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: React.PropsWithChildren<{}>) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (toast: Exclude<Toast, "id">) => {
    //Ran id by time and random number to make it unique
    toast.id = `${Date.now()}-${Math.random()}`;
    setToasts([...toasts, toast]);
  };
  const removeToast = (id: string) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };

  const toastValue = React.useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <ToastUI.Provider duration={3000}>
      <ToastContext.Provider value={toastValue}>{children}</ToastContext.Provider>

      {toasts.map((toast) => (
        <ToastUI.Root
          key={toast.id}
          className={`${typeToClass(
            toast.type
          )} rounded-md p-4 max-w-[calc(100vw-2rem)] mb-2 shadow-md flex flex-col relative min-w-[300px]`}
        >
          <ToastUI.Title className="text-lg font-medium mb-2">{toast.title}</ToastUI.Title>
          <ToastUI.Description className="text-sm leading-3">{toast.message}</ToastUI.Description>
          <ToastUI.Close aria-label="close toast button" className="absolute top-2 right-2">
            <IoClose />
          </ToastUI.Close>
        </ToastUI.Root>
      ))}
      <ToastUI.Viewport className="fixed bottom-0 right-0 px-2 py-4" />
    </ToastUI.Provider>
  );
}

function typeToColor(type: Toast["type"]) {
  switch (type) {
    case "success":
      return "green";
    case "error":
      return "red";
    case "warning":
      return "yellow";
    case "info":
      return "blue";
  }
}

function typeToClass(type: Toast["type"]) {
  switch (type) {
    case "success":
      return "bg-green-500/30 text-green-500 border border-green-500/80";
    case "error":
      return "bg-red-500/30 text-red-500 border border red-500/80";
    case "warning":
      return "bg-yellow-500/30 text-yellow-500 border border yellow-500/80";
    case "info":
      return "bg-blue-500/30 text-blue-500 border border blue-500/80";
  }
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}