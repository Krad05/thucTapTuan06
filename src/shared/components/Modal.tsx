import { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal.* phải nằm bên trong <Modal>');
  return context;
}

export function Modal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <ModalContext.Provider value={{ open, setOpen }}>{children}</ModalContext.Provider>;
}

Modal.Trigger = function Trigger({ children }: { children: ReactNode }) {
  const { setOpen } = useModal();
  return (
    <span className="modal-trigger" onClick={() => setOpen(true)}>
      {children}
    </span>
  );
};

Modal.Content = function Content({ children }: { children: ReactNode }) {
  const { open, setOpen } = useModal();
  if (!open) return null;
  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
    >
      <div className="modal" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
};

Modal.Close = function Close({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: (close: () => void) => void;
}) {
  const { setOpen } = useModal();
  return (
    <span
      className="modal-close"
      onClick={() => (onClick ? onClick(() => setOpen(false)) : setOpen(false))}
    >
      {children}
    </span>
  );
};
