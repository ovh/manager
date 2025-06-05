import { PciModal } from '@ovh-ux/manager-pci-common';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
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
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { confirmIAMSchema } from '@/schema/formSchema';
import { IAMchemaType, TRegistryAction } from '@/types';
import { IAM_DOC_LINKS } from '@/constants';
import { TRegistryStatus } from '@/api/data/registry';

const IAMAuthDisableDescription = () => {
  const { t } = useTranslation(['common', 'common_field']);
  return (
    <div>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="font-bold"
      >
        {t('private_registry_iam_authentication_disable_description_title')}
      </OsdsText>

      <ul className="text-[--ods-color-text-500]">
        {[1, 2, 3].map((partNumber) => (
          <li key={partNumber}>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <Trans
                i18nKey={`private_registry_iam_authentication_disable_description_part_${partNumber}`}
                components={{ strong: <strong /> }}
                ns="common"
              />
            </OsdsText>
          </li>
        ))}
      </ul>
    </div>
  );
};

type TIAMModalProps = {
  iamEnabled: boolean;
  registryStatus: TRegistryStatus;
  onManageIAM: () => void;
  onFailure: (message: string) => void;
  onQuit: (action: TRegistryAction) => void;
  loading?: boolean;
};

export const IAMModal = ({
  iamEnabled,
  registryStatus,
  loading,
  onManageIAM,
  onFailure,
  onQuit,
}: TIAMModalProps) => {
  const { t } = useTranslation(['common', 'common_field']);
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const iamLink = ovhSubsidiary
    ? IAM_DOC_LINKS[ovhSubsidiary as keyof typeof IAM_DOC_LINKS]
    : IAM_DOC_LINKS.DEFAULT;

  const handleQuit = (action: TRegistryAction) => () => onQuit(action);

  const { handleSubmit, control } = useForm<IAMchemaType>({
    resolver: zodResolver(confirmIAMSchema()),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (registryStatus !== 'READY') {
      onFailure(
        'private_registry_iam_authentication_management_registry_status_failure_message',
      );
      onQuit('FAILURE');
    }
  }, [onFailure, onQuit, registryStatus]);

  return (
    <PciModal
      title={t('private_registry_iam_authentication_manage', {
        manage: iamEnabled
          ? t('private_registry_common_status_DISABLE')
          : t('private_registry_common_status_ENABLE'),
      })}
      isPending={loading}
      onConfirm={handleSubmit(onManageIAM)}
      onClose={handleQuit('CLOSE')}
      onCancel={handleQuit('CANCEL')}
    >
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-6">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className="text-[--ods-color-warning-800]"
        >
          <Trans
            i18nKey={
              iamEnabled
                ? 'private_registry_iam_authentication_disable_warning'
                : 'private_registry_iam_authentication_enable_warning'
            }
            components={{ strong: <strong /> }}
            parent="span"
            ns="common"
          />
        </OsdsText>
      </OsdsMessage>
      {iamEnabled ? (
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
              ns="common"
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
              data-testid="confirm-manage_iam-input"
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
