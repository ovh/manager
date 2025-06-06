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
import { useContext } from 'react';
import { confirmIAMSchema } from '@/schema/formSchema';
import { ConfirmIAMchemaType } from '@/types';
import { IAM_DOC_LINKS } from '@/constants';

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

type TIAMModalProps = {
  iamEnabled: boolean;
  onManageIAM: () => void;
  onQuit: (action: 'CLOSE' | 'CANCEL') => void;
};

export const IAMModal = ({
  iamEnabled,
  onManageIAM,
  onQuit,
}: TIAMModalProps) => {
  const { t } = useTranslation(['common', 'common_field']);
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const iamLink = IAM_DOC_LINKS[ovhSubsidiary] || IAM_DOC_LINKS.DEFAULT;

  const handleQuit = (action: 'CLOSE' | 'CANCEL') => () => onQuit(action);

  const { handleSubmit, control } = useForm<ConfirmIAMchemaType>({
    resolver: zodResolver(confirmIAMSchema()),
    mode: 'onSubmit',
  });

  return (
    <PciModal
      title={t('private_registry_iam_authentication_manage', {
        manage: iamEnabled
          ? t('private_registry_common_status_DISABLE')
          : t('private_registry_common_status_ENABLE'),
      })}
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
