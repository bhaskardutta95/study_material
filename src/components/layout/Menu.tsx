import { NavLink } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';

/**
 * Header nav: Home + global topic search.
 * (Per-subject links live in the sidebar contents tree, not here.)
 */
export default function Menu() {
  return (
    <nav className="menu" aria-label="Primary">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          'menu__link' + (isActive ? ' menu__link--active' : '')
        }
      >
        Home
      </NavLink>
      <GlobalSearch />
    </nav>
  );
}
