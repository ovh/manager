import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { useInstances } from '@/api/hooks/useInstances';
import { TBasicIpRow } from '@/types/publicip.type';

type AttachBasicIPProps = {
  projectId: string;
  basicIp: TBasicIpRow;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (instanceId: string) => void;
};

export default function AttachBasicIPModal({
  projectId,
  basicIp,
  isPending,
  onClose,
  onConfirm,
}: Readonly<AttachBasicIPProps>) {
  const { t } = useTranslation('common');
  const { data: instances } = useInstances(projectId);
  const [instanceId, setInstanceId] = useState<string>(null);

  const regionInstances = (instances || []).filter(
    (instance) => instance.region === basicIp.region,
  );

  return (
    <PciModal
      title={t('pci_additional_ips_basic_ip_attach_title', { ip: basicIp.ip })}
      cancelText={t(
        'pci_additional_ips_floating_ips_floating_ip_terminate_cancel',
      )}
      submitText={t('pci_additional_ips_basic_ip_attach')}
      isPending={isPending}
      isDisabled={!instanceId || isPending}
      onConfirm={() => onConfirm(instanceId)}
      onClose={onClose}
      onCancel={onClose}
    >
      <OsdsSelect
        required
        value={instanceId}
        onOdsValueChange={(event) => setInstanceId(String(event.detail.value))}
      >
        <span slot="placeholder">
          {t('pci_additional_ips_basic_ip_attach_instance_label')}
        </span>
        {regionInstances.map((instance) => (
          <OsdsSelectOption key={instance.id} value={instance.id}>
            {instance.name}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
    </PciModal>
  );
}
