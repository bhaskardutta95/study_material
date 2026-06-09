import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  /** Language label shown in the bar (e.g. "sql", "c", "text"). */
  lang?: string;
}

/**
 * Reusable code renderer with a language label and copy button.
 * Used everywhere a snippet appears, so styling/behaviour stay consistent.
 */
export default function CodeBlock({ code, lang = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable (e.g. non-secure context) — ignore */
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__lang">{lang}</span>
        <button type="button" className="code-block__copy" onClick={copy}>
          {copied ? '✓ Copied' : '⧉ Copy'}
        </button>
      </div>
      <pre className="code-block__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
