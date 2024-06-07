import { Notifications } from '@ovhcloud/manager-components';
import { Outlet } from 'react-router-dom';

export default function ListingPage() {
  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
}
