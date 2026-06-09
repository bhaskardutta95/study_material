import type { ReactNode, CSSProperties } from 'react';
import Header from './Header';
import Footer from './Footer';
import { softColor } from '../../utils/color';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional accent colour that themes this page (e.g. a subject's colour). */
  accent?: string;
}

/**
 * The single page shell: Header + main content + Footer.
 * Every page renders through this, so layout lives in exactly one place.
 * Setting `accent` overrides the --accent token for everything inside.
 */
export default function PageLayout({ children, accent }: PageLayoutProps) {
  const style = accent
    ? ({ '--accent': accent, '--accent-soft': softColor(accent) } as CSSProperties)
    : undefined;

  return (
    <div className="app-shell" style={style}>
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
