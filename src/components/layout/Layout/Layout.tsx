import Matrix from 'react-matrix-effect';
import { Outlet } from 'react-router-dom';

import { Navbar } from '..';
import Notifications from '../Notifications/Notifications';

function Layout() {
  return (
    <div>
      <Navbar />
      <Matrix
        fullscreen={true}
        style={{
          zIndex: '1000',
          position: 'fixed',
          background: 'none',
          display: 'flex',
          opacity: '0.3',
        }}
        speed={0.5}
      />

      <Outlet />
      <Notifications />
    </div>
  );
}
export default Layout;
