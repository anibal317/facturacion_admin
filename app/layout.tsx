// app/layout.tsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import '@/app/globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <html>
        <body>

          <main>{children}</main>
        </body>
      </html>
    </AuthProvider>
  );
};

export default Layout;