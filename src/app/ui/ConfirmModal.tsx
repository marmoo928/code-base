'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes modal-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-modal { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade { animation: fade-in 0.3s ease-out; }
      `}</style>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl overflow-hidden animate-modal">
        {/* Glow effect */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-20 rounded-full ${isDestructive ? 'bg-red-500' : 'bg-indigo-500'}`} />

        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-stone-400 mb-8 leading-relaxed font-medium">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 rounded-2xl border border-neutral-800 text-stone-400 font-bold hover:bg-neutral-800 hover:text-white transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3.5 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
              isDestructive 
                ? 'bg-red-500 text-white hover:bg-red-400 shadow-red-500/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
