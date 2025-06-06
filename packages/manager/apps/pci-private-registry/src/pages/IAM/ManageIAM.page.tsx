import { useCallback, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Translation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetCachedRegistry } from '@/api/hooks/useRegistry';
import {
  useEnableIAMAuthentication,
  useDisableIAMAuthentication,
} from '@/api/hooks/useIAMAuthentication';
import { IAMModal } from './IAMModal/IAMModal';

const ManageIAM = () => {
  const navigate = useNavigate();
  const { shell } = useContext(ShellContext);
  const { addError, addSuccess } = useNotifications();
  const { projectId, registryId } = useParams();

  if (!projectId || !registryId) return null;

  const registry = useGetCachedRegistry(projectId, registryId);

  const returnToList = () =>
    navigate(`/pci/projects/${projectId}/private-registry`);

  const handleSuccess = useCallback(
    (message: string) => {
      addSuccess(
        <Translation ns="common">
          {(_t) =>
            _t(message, {
              registryId,
            })
          }
        </Translation>,
        true,
      );
      returnToList();
    },
    [registryId, navigate, addSuccess],
  );

  const handleFailure = useCallback(
    (message: string, error?: ApiError) => {
      addError(
        <Translation ns="common">
          {(_t) =>
            _t(message, {
              registryId,
              status: registry.status,
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      returnToList();
    },
    [registryId, navigate, addError],
  );

  const { enableIAMAuthentication } = useEnableIAMAuthentication({
    onSuccess: () =>
      handleSuccess(
        'private_registry_iam_authentication_enable_success_message',
      ),
    onError: (error: ApiError) =>
      handleFailure(
        'private_registry_iam_authentication_enable_failure_message',
        error,
      ),
  });

  const { disableIAMAuthentication } = useDisableIAMAuthentication({
    onSuccess: () =>
      handleSuccess(
        'private_registry_iam_authentication_disable_success_message',
      ),
    onError: (error: ApiError) =>
      handleFailure(
        'private_registry_iam_authentication_disable_failure_message',
        error,
      ),
  });

  const handleQuitModal = (action: 'CLOSE' | 'CANCEL') => {
    shell.tracking.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_${action}`,
      type: 'action',
    });
    returnToList();
  };

  const manageIAMAuthentication = useCallback(
    () =>
      registry.iamEnabled
        ? disableIAMAuthentication({ projectId, registryId })
        : enableIAMAuthentication({ projectId, registryId, deleteUsers: true }),
    [
      registry.iamEnabled,
      projectId,
      registryId,
      disableIAMAuthentication,
      enableIAMAuthentication,
    ],
  );

  useEffect(() => {
    if (registry.status !== 'READY') {
      handleFailure(
        'private_registry_iam_authentication_management_registry_status_failure_message',
      );
      navigate(`/pci/projects/${projectId}/private-registry`);
    }
  }, [registry.status, projectId]);

  return (
    <IAMModal
      iamEnabled={registry.iamEnabled}
      onManageIAM={manageIAMAuthentication}
      onQuit={handleQuitModal}
    />
  );
};

export default ManageIAM;
