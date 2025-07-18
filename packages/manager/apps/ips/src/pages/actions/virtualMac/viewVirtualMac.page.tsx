import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { useGetIpdetails, useGetIpVmac } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';
import { useGetIpVmacDetails } from '@/data/hooks/ip/useGetIpVmacDetails';

export default function ViewVirtualMacModal() {
  const { t } = useTranslation(['virtual-mac', NAMESPACES.ACTIONS, 'error']);
  const [type, setType] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [virtualMachineName, setVirtualMachineName] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({ ip });
  const serviceName = ipDetails?.routedTo?.serviceName;

  // Api call to retrive all existing vmacs for a server
  const { vmacs, isLoading: isVmacLoading, error } = useGetIpVmac({
    serviceName,
    enabled: Boolean(serviceName),
  });

  const {
    dedicatedServerVmacWithIpResponse,
    isLoading: isVmacWithIpLoading,
  } = useGetIpVmacDetails({
    serviceName,
    ip,
    macAddress,
    enabled: macAddress !== '' && Boolean(serviceName),
  });

  useEffect(() => {
    if (vmacs) {
      setType(vmacs[0]?.type);
      setMacAddress(vmacs[0]?.macAddress);
    }
  }, [vmacs]);

  useEffect(() => {
    if (dedicatedServerVmacWithIpResponse) {
      setVirtualMachineName(
        dedicatedServerVmacWithIpResponse?.virtualMachineName,
      );
    }
  }, [dedicatedServerVmacWithIpResponse]);

  const close = () => navigate('..');

  const fields = useMemo(
    () => [
      {
        label: t('virtualMacIpAddress'),
        value: ip,
        key: 'ipAddress',
      },
      {
        label: t('virtualMacField'),
        value: macAddress,
        key: 'macAddress',
      },
      { label: t('virtualMacType'), value: type, key: 'type' },
      {
        label: t('virtualMacMachinename'),
        value: virtualMachineName,
        key: 'virtualMachineName',
      },
    ],
    [ip, macAddress, type, virtualMachineName],
  );

  return (
    <Modal
      isOpen={true}
      onDismiss={close}
      heading={t('viewVirtualMacTitle')}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={close}
      isLoading={isIpDetailsLoading || isVmacLoading || isVmacWithIpLoading}
    >
      <div>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
          {t('viewVirtualMacQuestion')}
        </OdsText>
        {fields.map(({ label, value, key }) => (
          <div className="block mb-2">
            <OdsText
              className="font-semibold text-right min-w-[200px]"
              key={key}
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
