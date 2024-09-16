import { OsdsText } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import {
  useDeleteRegistry,
  useGetAllRegistries,
} from '@/api/hooks/useRegistry';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation();
  const { tracking } = useContext(ShellContext)?.shell || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const registryId = searchParams.get('registryId');

  const {
    data: registries,
    isPending: isPendingAllRegisters,
  } = useGetAllRegistries(projectId);

  const registry = registries?.find((r) => r.id === registryId);

  const onClose = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_DELETE_CLOSE`,
    });
    navigate('..');
  };

  const { deleteRegistry, isPending: isPendingDelete } = useDeleteRegistry({
    projectId,
    registryId,
    onError(error: ApiError) {
      addError(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_delete_error', {
              message: error?.response?.data?.message || error?.message || null,
              registryName: registry.name,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_delete_success', {
              registryName: registry.name,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const onConfirm = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_DELETE_CONFIRM`,
    });
    deleteRegistry();
  };

  const onCancel = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_DELETE_CANCEL`,
    });
    navigate('..');
  };

  const isPending = isPendingDelete || isPendingAllRegisters;

  return (
    <DeletionModal
      title={t('private_registry_delete')}
      isPending={isPending}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      confirmationText="DELETE"
      confirmationLabel={t('private_registry_delete_enter')}
      cancelText={t('private_registry_common_cancel')}
      submitText={t('private_registry_common_delete')}
      type="warning"
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('private_registry_delete_confirmation', {
          registryName: registry?.name,
        })}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('private_registry_delete_warning')}
      </OsdsText>
    </DeletionModal>
  );
}
