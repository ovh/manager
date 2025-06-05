import { useCallback, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsMessage,
  OsdsText,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Trans, Translation, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCachedRegistry } from '@/api/hooks/useRegistry';
import {
  useEnableIAMAuthentication,
  useDisableIAMAuthentication,
} from '@/api/hooks/useIAMAuthentication';
import { IAM_DOC_LINKS } from '@/constants';
import { confirmIAMSchema } from '@/schema/formSchema';
import { ConfirmIAMchemaType } from '@/types';

const IAMAuthDisableDescription = () => (
  <div>
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      <Trans
        i18nKey="private_registry_iam_authentication_disable_description_title"
        components={{ strong: <strong /> }}
      />
    </OsdsText>
    <ul>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        <Trans
          i18nKey="private_registry_iam_authentication_disable_description"
          components={{ strong: <strong />, li: <li /> }}
        />
      </OsdsText>
    </ul>
  </div>
);

const ManageIAM = () => {
  const { t } = useTranslation(['common', 'common_field']);
  const navigate = useNavigate();
  const { environment, shell } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const iamLink = IAM_DOC_LINKS[ovhSubsidiary] || IAM_DOC_LINKS.DEFAULT;

  const { addError, addSuccess } = useNotifications();
  const { tracking } = shell || {};
  const { projectId, registryId } = useParams();

  if (!projectId || !registryId) return null;

  const { handleSubmit, control } = useForm<ConfirmIAMchemaType>({
    resolver: zodResolver(confirmIAMSchema()),
    mode: 'onSubmit',
  });

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

  const handleClose = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_CLOSE`,
      type: 'action',
    });
    returnToList();
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_CANCEL`,
      type: 'action',
    });
    returnToList();
  };

  const manageIamAuthentication = useCallback(
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
    <PciModal
      title={t('private_registry_iam_authentication_manage', {
        manage: registry.iamEnabled
          ? t('private_registry_common_status_DISABLE')
          : t('private_registry_common_status_ENABLE'),
      })}
      onConfirm={handleSubmit(manageIamAuthentication)}
      onClose={handleClose}
      onCancel={handleCancel}
    >
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-6">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className="text-[--ods-color-warning-800]"
        >
          <Trans
            i18nKey={
              registry.iamEnabled
                ? 'private_registry_iam_authentication_disable_warning'
                : 'private_registry_iam_authentication_enable_warning'
            }
            components={{ strong: <strong /> }}
            parent="span"
          />
        </OsdsText>
      </OsdsMessage>
      {registry.iamEnabled ? (
        <IAMAuthDisableDescription />
      ) : (
        <>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            <Trans
              i18nKey="private_registry_iam_authentication_enable_description_part_1"
              components={{ strong: <strong /> }}
              parent="span"
            />
          </OsdsText>

          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            className="mt-6 block"
          >
            {t('private_registry_iam_authentication_enable_description_part_2')}
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              href={iamLink}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              <span className="flex items-center">
                {t('private_registry_iam_authentication_enable_more_info')}
                <OsdsIcon
                  className="ml-5"
                  aria-hidden="true"
                  name={ODS_ICON_NAME.ARROW_RIGHT}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </span>
            </OsdsLink>
          </OsdsText>
        </>
      )}
      <Controller
        name="confirmIAM"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <OsdsFormField
            className="mt-6"
            data-testid="confirm-formfield"
            error={error ? t('common_field:common_field_error_required') : ''}
          >
            <OsdsText
              slot="label"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
            >
              {t('private_registry_iam_authentication_confirm_label')}
            </OsdsText>
            <OsdsInput
              value={value}
              type={ODS_INPUT_TYPE.text}
              data-testid="update-input"
              onOdsValueChange={onChange}
              className={
                error
                  ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                  : 'border-color-[var(--ods-color-default-200)] bg-white'
              }
            />
          </OsdsFormField>
        )}
      />
    </PciModal>
  );
};

export default ManageIAM;
