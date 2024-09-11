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
import { useContext, useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useKubernetesCluster,
  useRenameKubernetesCluster,
} from '@/api/hooks/useKubernetes';
import { NAME_INPUT_CONSTRAINTS } from '@/constants';
import { KUBE_TRACK_PREFIX } from '@/tracking.constants';

export default function RenameClusterPage() {
  const { t: tEditName } = useTranslation('edit-name');
  const { t: tCommon } = useTranslation('common');
  const { projectId, kubeId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const {
    data: kubernetesCluster,
    isPending: isPendingCluster,
  } = useKubernetesCluster(projectId, kubeId);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({
    length: false,
    pattern: false,
  });
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { tracking } = useContext(ShellContext)?.shell || {};

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

  useEffect(() => {
    setErrors({
      length: name.length > NAME_INPUT_CONSTRAINTS.MAX_LENGTH,
      pattern: RegExp(NAME_INPUT_CONSTRAINTS.PATTERN).test(name) === false,
    });
  }, [name]);

  const canRename =
    isPendingCluster ||
    isPendingRename ||
    name === '' ||
    errors.length ||
    errors.pattern;

  return (
    <OsdsModal
      onOdsModalClose={() => {
        tracking?.trackClick({
          name: `${KUBE_TRACK_PREFIX}::details::service::name::cancel`,
        });
        onClose();
      }}
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
              data-testid="renameCluster-formfield"
              error={`${
                errors.pattern
                  ? tEditName(
                      'pci_projects_project_kubernetes_details_service_name_input_pattern_validation_error',
                    )
                  : ''
              } ${
                errors.length
                  ? tCommon('common_field_error_maxlength', {
                      maxlength: NAME_INPUT_CONSTRAINTS.MAX_LENGTH,
                    })
                  : ''
              }`}
              className="mt-6"
            >
              <div slot="label">
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={
                    errors.length || errors.pattern
                      ? ODS_TEXT_COLOR_INTENT.error
                      : ODS_THEME_COLOR_INTENT.text
                  }
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
                className={
                  errors.length || errors.pattern
                    ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                    : 'border-color-[var(--ods-color-default-200)] bg-white'
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
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::name::cancel`,
          });
          onClose();
        }}
        data-testid="renameCluster-button_cancel"
      >
        {tEditName(
          'pci_projects_project_kubernetes_details_service_name_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={canRename || undefined}
        onClick={() => {
          tracking?.trackClick({
            name: `${KUBE_TRACK_PREFIX}::details::service::name::confirm`,
          });
          renameCluster();
        }}
        data-testid="renameCluster-button_submit"
      >
        {tEditName('pci_projects_project_kubernetes_details_service_name_edit')}
      </OsdsButton>
    </OsdsModal>
  );
}
