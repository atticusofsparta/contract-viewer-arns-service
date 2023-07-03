import { Outlet } from 'react-router-dom';

import { Navbar } from '..';
import Notifications from '../Notifications/Notifications';

function Layout() {
  return (
    <div>
      <Navbar />

      <Outlet />
      <Notifications />
    </div>
  );
}
export default Layout;
