import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovhcloud/manager-components';
import {
  useKubernetesCluster,
  useRenameKubernetesCluster,
} from '@/api/hooks/useKubernetes';

export default function RenameClusterPage() {
  const { t: tEditName } = useTranslation('edit-name');
  const { projectId, kubeId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const {
    renameCluster,
    isPending: isPendingRename,
  } = useRenameKubernetesCluster({
    projectId,
    kubeId,
    name,
    onError(error: ApiError) {
      addError(
        <Translation ns="edit-name">
          {(_t) =>
            _t('pci_projects_project_kubernetes_details_service_name_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="edit-name">
          {(_t) =>
            _t('pci_projects_project_kubernetes_details_service_name_success')
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });
  useEffect(() => {
    setName(kubernetesCluster?.name || '');
  }, [kubernetesCluster]);
  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={tEditName(
        'pci_projects_project_kubernetes_details_service_name',
      )}
    >
      <slot name="content">
        {isPendingCluster || isPendingRename ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="renameCluster-spinner"
          />
        ) : (
          <div className="mt-6">
            <OsdsText
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {tEditName(
                'pci_projects_project_kubernetes_details_service_name_default',
                {
                  name: kubernetesCluster?.id,
                },
              )}
            </OsdsText>
            <OsdsFormField
              data-testid="renameCluster-input_name"
              className="mt-6"
            >
              <div slot="label">
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_TEXT_COLOR_INTENT.text}
                >
                  {tEditName(
                    'pci_projects_project_kubernetes_details_service_name_custom',
                  )}
                </OsdsText>
              </div>
              <OsdsInput
                value={name}
                defaultValue={name}
                data-testid="renameCluster-input_name"
                type={ODS_INPUT_TYPE.text}
                onOdsValueChange={(event: OdsInputValueChangeEvent) =>
                  setName(event.detail.value)
                }
              />
            </OsdsFormField>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => onClose()}
        data-testid="renameCluster-button_cancel"
      >
        {tEditName(
          'pci_projects_project_kubernetes_details_service_name_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        {...((isPendingCluster || isPendingRename || name === '') && {
          disabled: true,
        })}
        onClick={renameCluster}
        data-testid="renameCluster-button_submit"
      >
        {tEditName('pci_projects_project_kubernetes_details_service_name_edit')}
      </OsdsButton>
    </OsdsModal>
  );
}
