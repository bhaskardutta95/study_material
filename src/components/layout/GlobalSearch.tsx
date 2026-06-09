import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTopics, type TopicHit } from '../../utils/search';

/**
 * Global topic search shown in the header. Searches every subject's topics and
 * jumps to the chosen one (subject page + `?t=` → the card opens and scrolls).
 */
export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Only scan the content tree while the dropdown is actually showing.
  const showDropdown = open && query.trim().length > 0;
  const results = useMemo(
    () => (showDropdown ? searchTopics(query, 8) : []),
    [showDropdown, query],
  );

  // Close the dropdown when clicking outside the component.
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  function go(hit: TopicHit) {
    navigate(`/subject/${hit.subject.id}?t=${hit.anchor}`);
    setQuery('');
    setOpen(false);
    setActive(0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    // Don't act on Enter/arrows when no dropdown is visible.
    if (!showDropdown) {
      if (e.key === 'Escape') setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="gsearch" ref={wrapRef}>
      <span className="gsearch__icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="search"
        className="gsearch__input"
        placeholder="Search all topics…"
        value={query}
        aria-label="Search all topics"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {showDropdown && (
        <ul className="gsearch__results" role="listbox">
          {results.length === 0 ? (
            <li className="gsearch__empty">No matches for “{query}”</li>
          ) : (
            results.map((hit, i) => (
              <li key={`${hit.subject.id}-${hit.anchor}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className="gsearch__result"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(hit)}
                >
                  <span className="gsearch__result-name">{hit.topic.name}</span>
                  <span className="gsearch__result-ctx">
                    {hit.subject.code} · {hit.module.name}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
