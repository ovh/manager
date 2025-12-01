import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { VCDResourceStatus, isStatusTerminated } from '@ovh-ux/manager-module-vcd-api';

import { Message } from './Message.component';

export default function MessageSuspendedService({ status }: { status: VCDResourceStatus }) {
  const { t } = useTranslation(NAMESPACES.BILLING);
  const [uid] = React.useState(() => Date.now());

  if (!isStatusTerminated(status)) return null;

  return (
    <div className="flex flex-col">
      <Message
        message={{
          uid,
          isDismissible: false,
          type: 'warning',
          content: t('cancel_service_success'),
          includedSubRoutes: [],
          excludedSubRoutes: [],
        }}
      />
    </div>
  );
}
