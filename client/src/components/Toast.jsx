import React from 'react';
import { useEcommerce } from '../context/EcommerceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useEcommerce();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`floating-toast toast-${toast.type} animate-slide-up`}>
      {icons[toast.type] || icons.info}
      <span className="toast-message-text">{toast.message}</span>
    </div>
  );
};
