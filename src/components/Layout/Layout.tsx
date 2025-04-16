import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;