import { useId, useState, type ReactNode } from 'react';

interface CollapsibleProps {
  /** Content of the always-visible trigger row. */
  header: ReactNode;
  /** Content revealed when open. */
  children: ReactNode;
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Controlled open state. When provided, the parent owns the state. */
  open?: boolean;
  /** Called with the next state on toggle (for controlled use). */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Generic open/close primitive. Owns the collapse logic in one place so any
 * card can compose it. Works uncontrolled (its own state) or controlled
 * (parent passes `open` + `onOpenChange`) — e.g. to force-open on navigation.
 */
export default function Collapsible({
  header,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const bodyId = useId();

  function toggle() {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div className="collapsible" data-open={open}>
      <button
        type="button"
        className="collapsible__trigger"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={toggle}
      >
        {header}
        <span className="collapsible__chevron" aria-hidden="true">
          ▶
        </span>
      </button>
      {open && (
        <div id={bodyId} className="collapsible__body">
          {children}
        </div>
      )}
    </div>
  );
}
