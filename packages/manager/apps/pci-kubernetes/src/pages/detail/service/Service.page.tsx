import { Outlet } from 'react-router-dom';

export default function ServicePage() {
  return (
    <div>
      <p>Kube Service</p>
      <Outlet />
    </div>
  );
}
