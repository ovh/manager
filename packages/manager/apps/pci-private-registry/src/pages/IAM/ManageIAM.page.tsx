import { useCallback, useContext, useEffect, useState } from 'react';
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
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Trans, Translation, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetRegistryIAM } from '@/api/hooks/useRegistry';
import { useEnableIAMAuthentication } from '@/api/hooks/useEnableIAMAuthentication';
import { useDisableIAMAuthentication } from '@/api/hooks/useDisableIAMAuthentication';

const ManageIAM = () => {
  const { t } = useTranslation(['common', 'common_field']);
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const { addError, addSuccess } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};
  const { projectId, registryId } = useParams();

  const [formState, setFormState] = useState({
    terminateInput: '',
    hasError: false,
    isTouched: false,
  });

  const { data: iamStatus, isPending } = useGetRegistryIAM(
    projectId,
    registryId,
  );

  const { enableIAMAuthentication } = useEnableIAMAuthentication({
    onSuccess: () => {
      addSuccess(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_iam_authentication_enable_success_message', {
              registry: registryId,
            })
          }
        </Translation>,
        true,
      );
      navigate(-1);
    },
    onError: (error: ApiError) => {
      addError(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_iam_authentication_enable_failure_message', {
              registry: registryId,
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      navigate(-1);
    },
  });

  const { disableIAMAuthentication } = useDisableIAMAuthentication({
    onSuccess: () => {
      addSuccess(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_iam_authentication_disable_success_message', {
              registry: registryId,
            })
          }
        </Translation>,
        true,
      );
      navigate(-1);
    },
    onError: (error: ApiError) => {
      addError(
        <Translation ns="common">
          {(_t) =>
            _t('private_registry_iam_authentication_disable_failure_message', {
              registry: registryId,
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
      navigate(-1);
    },
  });

  const handleClose = useCallback(() => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_CLOSE`,
      type: 'action',
    });
    navigate(-1);
  }, []);

  const handleCancel = useCallback(() => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_IAM_CANCEL`,
      type: 'action',
    });
    navigate(-1);
  }, []);

  const handleInputBlur = useCallback(
    () =>
      setFormState((form) => ({
        ...form,
        isTouched: true,
      })),
    [],
  );

  const handleInputChange = useCallback(
    (event: OdsInputValueChangeEvent) =>
      setFormState((form) => ({
        ...form,
        terminateInput: event.detail.value,
      })),
    [],
  );

  const handleConfirm = useCallback(
    () =>
      iamStatus
        ? disableIAMAuthentication({ projectId, registryId })
        : enableIAMAuthentication({ projectId, registryId, deleteUsers: true }),
    [iamStatus],
  );

  const isDisabled = isPending || formState.terminateInput !== 'CONFIRM';

  useEffect(() => {
    const newErrorValue =
      formState.isTouched && formState.terminateInput !== 'CONFIRM';
    if (formState.hasError !== newErrorValue)
      setFormState((form) => ({
        ...form,
        hasError: newErrorValue,
      }));
  }, [formState.isTouched, formState.terminateInput]);
  useEffect(
    () => console.log('🚀 ~ ManageIAM ~ ovhSubsidiary:', ovhSubsidiary),
    [ovhSubsidiary],
  );
  return (
    <PciModal
      title={t('private_registry_iam_authentication_manage', {
        manage: iamStatus
          ? t('private_registry_common_status_DISABLE')
          : t('private_registry_common_status_ENABLE'),
      })}
      isPending={isPending}
      isDisabled={isDisabled}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
    >
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-6">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className="text-[--ods-color-warning-800]"
        >
          {iamStatus ? (
            <Trans
              i18nKey="private_registry_iam_authentication_disable_warning"
              components={{ strong: <strong /> }}
              parent="span"
            />
          ) : (
            <Trans
              i18nKey="private_registry_iam_authentication_enable_warning"
              components={{ strong: <strong /> }}
              parent="span"
            />
          )}
        </OsdsText>
      </OsdsMessage>
      {iamStatus ? (
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          <Trans
            i18nKey="private_registry_iam_authentication_disable_description_title"
            components={{ strong: <strong /> }}
            parent="span"
          />
          <ul>
            <li>
              <Trans
                i18nKey="private_registry_iam_authentication_disable_description_part_1"
                components={{ strong: <strong /> }}
                parent="span"
              />
            </li>
            <li>
              <Trans
                i18nKey="private_registry_iam_authentication_disable_description_part_2"
                components={{ strong: <strong /> }}
                parent="span"
              />
            </li>
            <li>
              <Trans
                i18nKey="private_registry_iam_authentication_disable_description_part_3"
                components={{ strong: <strong /> }}
                parent="span"
              />
            </li>
          </ul>
        </OsdsText>
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
              // TODO: add url link
              // href={getIAMUrl()}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {t('private_registry_iam_authentication_enable_more_info')}
              <OsdsIcon
                className="ml-5"
                aria-hidden="true"
                name={ODS_ICON_NAME.ARROW_RIGHT}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </OsdsLink>
          </OsdsText>
        </>
      )}
      <OsdsFormField
        class="mt-6"
        data-testid="confirm-formfield"
        error={
          formState.hasError
            ? t('common_field:common_field_error_required')
            : ''
        }
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
          value={formState.terminateInput}
          type={ODS_INPUT_TYPE.text}
          data-testid="update-input"
          onOdsValueChange={handleInputChange}
          className={
            formState.hasError
              ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
              : 'border-color-[var(--ods-color-default-200)] bg-white'
          }
          onOdsInputBlur={handleInputBlur}
        />
      </OsdsFormField>
    </PciModal>
  );
};

export default ManageIAM;
