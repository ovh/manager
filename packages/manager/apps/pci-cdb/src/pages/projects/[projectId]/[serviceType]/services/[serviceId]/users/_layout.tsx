import { Outlet, useOutletContext } from 'react-router-dom';
import { database } from '@/models/database';

export const Handle = {
  breadcrumb: () => 'Users',
};

export default function ServiceLayout() {
  const parentContext = useOutletContext() as database.Service;
  return (
    <>
      <Outlet context={parentContext} />
    </>
  );
}
