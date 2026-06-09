import { Link } from 'react-router-dom';
import Menu from './Menu';

/**
 * Site header — brand + subject menu. Shared by every page via PageLayout.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        <span className="site-header__brand-mark">📚</span>
        <span>StudyDeck</span>
      </Link>
      <div className="site-header__spacer" />
      <Menu />
    </header>
  );
}
