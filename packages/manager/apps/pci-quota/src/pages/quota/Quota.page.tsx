import { Outlet } from 'react-router-dom';

export default function QuotaPage(): JSX.Element {
  return (
    <div>
      Quota Page
      <Outlet />
    </div>
  );
}
