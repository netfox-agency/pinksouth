import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: number;
  message: string;
}

const ToastContext = createContext<{ toast: (message: string) => void } | null>(
  null
);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ol className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-[420px] flex-col gap-2 p-4">
        {toasts.map((t) => (
          <li
            key={t.id}
            className="pointer-events-auto animate-fade-in rounded-lg border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card"
          >
            {t.message}
          </li>
        ))}
      </ol>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
