import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  OsdsModal,
  OsdsButton,
  OsdsFormField,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type DeleteModalProps = {
  onClose: () => void;
  tokenName: string;
  onSubmit: () => void;
};

type FormValues = Record<string, never>;

export default function DeleteModal({
  onClose,
  tokenName,
  onSubmit,
}: DeleteModalProps) {
  const { t } = useTranslation('token');
  const { handleSubmit } = useForm<FormValues>();

  const onFormSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onClose}
      headline={t('ai_endpoints_token_deletion')}
    >
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-4"
          size={ODS_TEXT_SIZE._400}
        >
          {t('ai_endpoints_token_deletion_message')}{' '}
          <span className="pl-1">
            <strong>{tokenName}</strong>
          </span>
          ?
        </OsdsText>
      </OsdsFormField>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={handleSubmit(onFormSubmit)}
      >
        {t('ai_endpoints_token_deletion_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
