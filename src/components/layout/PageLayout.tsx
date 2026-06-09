import { useState, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SidebarNav from './SidebarNav';
import { accentStyle } from '../../utils/color';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional accent colour that themes this page (e.g. a subject's colour). */
  accent?: string;
}

/**
 * The single page shell: Header + (Sidebar | main) + Footer.
 * Every page renders through this, so layout lives in exactly one place.
 * Setting `accent` overrides the --accent token for everything inside.
 */
export default function PageLayout({ children, accent }: PageLayoutProps) {
  // Mobile drawer state for the contents sidebar.
  const [navOpen, setNavOpen] = useState(false);

  const style = accent ? accentStyle(accent) : undefined;

  return (
    <div className="app-shell" style={style}>
      <Header onMenuToggle={() => setNavOpen((v) => !v)} />
      <div className="app-body">
        <SidebarNav open={navOpen} onNavigate={() => setNavOpen(false)} />
        <main className="app-main">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
