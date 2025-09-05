import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  isStatusTerminated,
  VCDResourceStatus,
} from '@ovh-ux/manager-module-vcd-api';
import { useTranslation } from 'react-i18next';
import { Message } from './Message.component';

export default function MessageSuspendedService({
  status,
}: {
  status: VCDResourceStatus;
}) {
  const { t } = useTranslation(NAMESPACES.BILLING);

  if (!isStatusTerminated(status)) return null;

  return (
    <div className="flex flex-col">
      <Message
        message={{
          uid: Date.now(),
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
