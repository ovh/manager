import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';

type NameCellProps = {
  server: DedicatedServer;
  navigate: (name: string) => void;
};

export const NameCell: React.FC<NameCellProps> = ({ server, navigate }) => {
  const { t } = useTranslation('dedicated-servers');
  return (
    <DataGridTextCell>
      <OdsLink
        color="primary"
        href={`#/server/${server.name}`}
        onClick={() => {
          navigate(server.name);
        }}
        label={t(server?.iam?.displayName)}
      />
    </DataGridTextCell>
  );
};

export default NameCell;
