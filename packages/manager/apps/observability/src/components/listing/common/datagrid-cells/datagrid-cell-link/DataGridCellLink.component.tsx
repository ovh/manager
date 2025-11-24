import { useNavigate } from 'react-router-dom';

import { Link } from '@ovh-ux/muk';

import { getTenantDashboardUrl } from '@/routes/Routes.utils';

import { DataGridCellLinkProps } from './DataGridCellLink.props';

export default function DatagridCellLink({ id, label }: DataGridCellLinkProps) {
  const navigate = useNavigate();

  return (
    <Link
      onClick={() => {
        navigate(`${getTenantDashboardUrl(id)}`);
      }}
      data-testid={`cell-link-${id}`}
    >
      {label}
    </Link>
  );
}
