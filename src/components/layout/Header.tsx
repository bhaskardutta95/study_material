import { Link } from 'react-router-dom';
import Menu from './Menu';

interface HeaderProps {
  /** Toggles the contents sidebar (used on small screens). */
  onMenuToggle?: () => void;
}

/**
 * Site header — sidebar toggle + brand + subject menu.
 * Shared by every page via PageLayout.
 */
export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="site-header__menu-btn"
        aria-label="Toggle contents"
        onClick={onMenuToggle}
      >
        ☰
      </button>
      <Link to="/" className="site-header__brand">
        <span className="site-header__brand-mark">📚</span>
        <span>StudyDeck</span>
      </Link>
      <div className="site-header__spacer" />
      <Menu />
    </header>
  );
}
