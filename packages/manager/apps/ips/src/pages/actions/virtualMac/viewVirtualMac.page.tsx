import { useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useGetIpVmacDetails, useIpHasVmac } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function ViewVirtualMacModal() {
  const { t } = useTranslation(['virtual-mac', NAMESPACES.ACTIONS, 'error']);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, service: serviceName } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { trackClick } = useOvhTracking();

  const { ipvmac, isLoading: isVmacLoading } = useIpHasVmac({
    ip,
    serviceName,
    enabled: Boolean(serviceName),
  });

  const {
    dedicatedServerVmacWithIpResponse,
    isLoading: isVmacWithIpLoading,
  } = useGetIpVmacDetails({
    ip,
    serviceName,
    macAddress: ipvmac?.[0]?.macAddress,
  });

  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['view_virtual-mac', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  const fields = useMemo(
    () => [
      {
        label: t('virtualMacIpAddress'),
        value: ip,
        key: 'ipAddress',
      },
      {
        label: t('virtualMacField'),
        value: ipvmac?.[0]?.macAddress,
        key: 'macAddress',
      },
      { label: t('virtualMacType'), value: ipvmac?.[0]?.type, key: 'type' },
      {
        label: t('virtualMacMachinename'),
        value: dedicatedServerVmacWithIpResponse?.virtualMachineName,
        key: 'virtualMachineName',
      },
    ],
    [ip, ipvmac, dedicatedServerVmacWithIpResponse, t],
  );

  return (
    <Modal
      isOpen
      onDismiss={closeModal}
      heading={t('viewVirtualMacTitle')}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={closeModal}
      isLoading={isVmacLoading || isVmacWithIpLoading}
    >
      <div>
        <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
          {t('viewVirtualMacQuestion')}
        </OdsText>
        {fields.map(({ label, value, key }) => (
          <div key={key} className="mb-2 block">
            <OdsText
              className="min-w-[200px] text-right font-semibold"
              preset={ODS_TEXT_PRESET.heading6}
            >
              {label}
            </OdsText>
            <OdsText className="ml-2">{value}</OdsText>
          </div>
        ))}
      </div>
    </Modal>
  );
}
