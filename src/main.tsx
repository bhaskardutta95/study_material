import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// All shared styles are imported once, here. Components never import CSS —
// they only reference the shared class names. (common, reusable CSS)
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';

// HashRouter keeps deep links (/#/subject/dbms) working on static hosts like
// GitHub Pages with no server-side rewrite rules.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
