import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { IAMModal } from './IAMModal/IAMModal';
import { useRegistry } from '@/api/hooks/useRegistry';
import { useToggleIAMAuthentication } from '@/api/hooks/useIAMAuthentication';
import { TRegistryAction, TRegistryActionToggle } from '@/types';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useRegistryId } from '@/hooks/registry/usRegistryId';

const ManageIAM = () => {
  const navigate = useNavigate();
  const { shell } = useContext(ShellContext);
  const { addError, addSuccess } = useNotifications();
  const projectId = useProjectId();
  const registryId = useRegistryId();

  const { data: registry, isPending } =
    useRegistry(projectId, registryId) ?? {};

  const handleQuitModal = (action: TRegistryAction) => {
    shell.tracking.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_${action}`,
      type: 'action',
    });
    navigate(`/pci/projects/${projectId}/private-registry`);
  };

  const handleSuccess = useCallback(
    (message: string) => {
      addSuccess(
        <Translation ns="common">
          {(t) =>
            t(message, {
              registryId,
            })
          }
        </Translation>,
        true,
      );
    },
    [registryId, addSuccess],
  );

  const handleFailure = useCallback(
    (message: string, error?: ApiError) => {
      addError(
        <Translation ns="common">
          {(t) =>
            t(message, {
              registryId,
              status: registry?.status,
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
    },
    [addError, registryId, registry?.status],
  );

  const handleIAMChange = (action: TRegistryActionToggle) => ({
    onSuccess: () => {
      handleSuccess(
        `private_registry_iam_authentication_${action.toLowerCase()}_success_message`,
      );
      handleQuitModal(action);
    },
    onError: (error: ApiError) => {
      handleFailure(
        `private_registry_iam_authentication_${action.toLowerCase()}_failure_message`,
        error,
      );

      handleQuitModal('FAILURE');
    },
    action,
  });

  const { toggleIAMAuthentication } = useToggleIAMAuthentication(
    handleIAMChange(registry?.iamEnabled ? 'DISABLE' : 'ENABLE'),
  );

  const manageIAMAuthentication = useCallback(() => {
    if (projectId && registryId)
      toggleIAMAuthentication({
        projectId,
        registryId,
        ...(!registry?.iamEnabled && { deleteUsers: true }),
      });
  }, [toggleIAMAuthentication, projectId, registryId, registry?.iamEnabled]);

  useEffect(() => {
    if (!registry) handleFailure('private_registry_retrieving_failure');
  }, [registry, handleFailure]);

  return registry ? (
    <IAMModal
      iamEnabled={registry.iamEnabled}
      registryStatus={registry.status}
      loading={isPending}
      onManageIAM={manageIAMAuthentication}
      onFailure={handleFailure}
      onQuit={handleQuitModal}
    />
  ) : null;
};

export default ManageIAM;
