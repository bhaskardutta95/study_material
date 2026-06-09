import { useId, useState, type ReactNode } from 'react';

interface CollapsibleProps {
  /** Content of the always-visible trigger row. */
  header: ReactNode;
  /** Content revealed when open. */
  children: ReactNode;
  /** Whether it starts open. */
  defaultOpen?: boolean;
}

/**
 * Generic open/close primitive. Owns all the collapse logic in one place so
 * any card (topics today, anything tomorrow) can compose it. (reusable)
 */
export default function Collapsible({
  header,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className="collapsible" data-open={open}>
      <button
        type="button"
        className="collapsible__trigger"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
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
