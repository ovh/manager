import { useNotifications } from '@ovhcloud/manager-components';
import { useEffect, useState } from 'react';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAllFailoverIPs,
  useAttachInstance,
} from '@/api/hooks/useFailoverIP';
import { useAllInstance } from '@/api/hooks/useInstance';
import EditInstanceModal from '@/components/edit/EditAdditionalIP.component';
import { FailoverIP, ResponseAPIError } from '@/interface';

export default function EditInstancePage() {
  const [selectInstanceId, setSelectedInstanceId] = useState('');
  const [failoverIP, setFailoverIP] = useState<FailoverIP>(null);

  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { projectId, ipId } = useParams();

  const { data: instances, isLoading: instancesLoading } = useAllInstance(
    projectId || '',
  );

  const {
    data: failoverIPs,
    isLoading: failoverIPsLoading,
  } = useAllFailoverIPs(projectId || '');

  const onModalClose = () => navigate('..');

  const onAttachInstanceSuccess = () => {
    addSuccess(
      <Translation ns="failover-ips-edit">
        {(t) =>
          t('pci_additional_ips_failoverips_edit_success', {
            ip: failoverIP.ip,
          })
        }
      </Translation>,
    );
    onModalClose();
  };

  const onAttachInstanceError = (error: ResponseAPIError) => {
    addError(
      <Translation ns="failover-ips-edit">
        {(t) =>
          t('pci_additional_ips_failoverips_edit_error', {
            error: error?.response?.data?.message,
          })
        }
      </Translation>,
    );
    onModalClose();
  };

  const { attach, isPending: attachInstanceLoading } = useAttachInstance({
    projectId,
    ipId,
    instanceId: selectInstanceId,
    onSuccess: onAttachInstanceSuccess,
    onError: onAttachInstanceError,
  });

  const onModalConfirm = () => attach();

  const isPending =
    instancesLoading || failoverIPsLoading || attachInstanceLoading;

  const handleSelectChange = (event) => {
    setSelectedInstanceId(event?.detail?.value);
  };

  useEffect(() => {
    if (failoverIPs && failoverIPs.length !== 0) {
      const selectedFailover = failoverIPs.find(({ id }) => id === ipId);
      setFailoverIP(selectedFailover);

      if (instances && instances.length !== 0) {
        const selectedInstance = instances.find(
          ({ id }) => id === selectedFailover?.routedTo,
        );
        setSelectedInstanceId(selectedInstance?.id);
      }
    }
  }, [instances, failoverIPs]);

  return (
    <EditInstanceModal
      selectedIp={failoverIP?.ip}
      instances={instances}
      selectedInstanceId={selectInstanceId}
      isPending={isPending}
      onSelectChange={handleSelectChange}
      onClose={onModalClose}
      onConfirm={onModalConfirm}
    />
  );
}
