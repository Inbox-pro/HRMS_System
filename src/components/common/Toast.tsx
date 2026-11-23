import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  undoAction?: () => void;
  undoLabel?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, message, undoAction, undoLabel = 'Undo' }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, message, undoAction, undoLabel };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        dismissToast(id);
      }, undoAction ? 6000 : 4000);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-md w-full"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-center justify-between p-3 rounded-lg border text-[13px] shadow-lg transition-all transform animate-in slide-in-from-bottom-2 duration-200',
                'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-default)]'
              )}
            >
              <div className="flex items-center space-x-2.5 mr-3">
                {isSuccess && <CheckCircle2 size={16} className="text-[var(--success)] shrink-0" />}
                {isError && <AlertCircle size={16} className="text-[var(--danger)] shrink-0" />}
                {isWarning && <AlertCircle size={16} className="text-[var(--warning)] shrink-0" />}
                {!isSuccess && !isError && !isWarning && (
                  <Info size={16} className="text-[var(--info)] shrink-0" />
                )}
                <span className="font-medium text-[var(--text-primary)]">{toast.message}</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {toast.undoAction && (
                  <button
                    onClick={() => {
                      toast.undoAction?.();
                      dismissToast(toast.id);
                    }}
                    className="inline-flex items-center space-x-1 px-2 py-1 text-[12px] font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] rounded-[4px] transition-colors border border-[var(--brand-border)]"
                  >
                    <Undo2 size={12} strokeWidth={2} />
                    <span>{toast.undoLabel}</span>
                  </button>
                )}
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-[4px] transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
