import { useNavigate } from 'react-router-dom';

import { Links } from '@ovh-ux/manager-react-components';

import { DataGridCellLinkProps } from './DataGridCellLink.props';

export default function DatagridCellLink({ id, label, path }: DataGridCellLinkProps) {
  const navigate = useNavigate();

  return (
    <Links
      onClickReturn={() => {
        navigate(path);
      }}
      label={label}
      data-testid={`cell-link-${id}`}
    />
  );
}
