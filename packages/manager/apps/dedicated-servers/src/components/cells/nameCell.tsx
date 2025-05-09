import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import useGoToServer from '@/hooks/useGoToServer';

export const NameCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  const navigate = useGoToServer(server);
  return (
    <DataGridTextCell>
      <OdsLink
        color="primary"
        href={`#/server/${server.name}`}
        onClick={() => {
          navigate();
        }}
        label={t(server?.iam?.displayName)}
      />
    </DataGridTextCell>
  );
};

export default NameCell;
