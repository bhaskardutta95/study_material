import { NavLink } from 'react-router-dom';
import { subjects } from '../../content';

/**
 * Subject switcher. Reads the registry, so new subjects appear automatically.
 */
export default function Menu() {
  return (
    <nav className="menu" aria-label="Subjects">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          'menu__link' + (isActive ? ' menu__link--active' : '')
        }
      >
        Home
      </NavLink>
      {subjects.map((s) => (
        <NavLink
          key={s.id}
          to={`/subject/${s.id}`}
          className={({ isActive }) =>
            'menu__link' + (isActive ? ' menu__link--active' : '')
          }
        >
          {s.code}
        </NavLink>
      ))}
    </nav>
  );
}
