import { useNavigate } from 'react-router-dom';

import { Link } from '@ovh-ux/muk';

import { DataGridCellLinkProps } from './DataGridCellLink.props';

export default function DatagridCellLink({ id, label, path }: DataGridCellLinkProps) {
  const navigate = useNavigate();

  return (
    <Link
      onClick={() => {
        navigate(path);
      }}
      href="#"
      data-testid={`cell-link-${id}`}
    >
      {label}
    </Link>
  );
}
