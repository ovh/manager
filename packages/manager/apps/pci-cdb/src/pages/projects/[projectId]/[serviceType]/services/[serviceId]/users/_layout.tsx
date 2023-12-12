import { Outlet } from 'react-router-dom';

export const Handle = {
  breadcrumb: () => 'Users',
};

export default function ServiceLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
