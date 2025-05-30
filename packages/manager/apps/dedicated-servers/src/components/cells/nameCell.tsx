import { OdsLink } from '@ovhcloud/ods-components/react';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';
import { useServerUrl } from '@/hooks/useServerUrl';

export const NameCell = (server: DedicatedServer) => {
  const { t } = useTranslation('dedicated-servers');
  const serverUrl = useServerUrl(server);
  return (
    <DataGridTextCell>
      <OdsLink
        color="primary"
        href={serverUrl}
        label={t(server?.iam?.displayName)}
      />
    </DataGridTextCell>
  );
};

export default NameCell;
