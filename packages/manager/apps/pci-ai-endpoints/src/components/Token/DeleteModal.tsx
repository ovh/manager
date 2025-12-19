import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { OsdsModal } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Button, FormField, Text } from '@ovhcloud/ods-react';

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
      <FormField>
        <Text preset="paragraph" className="mt-4">
          {t('ai_endpoints_token_deletion_message')}
          <span className="pl-1">
            <strong>{tokenName}</strong>
          </span>
          ?
        </Text>
      </FormField>
      <Button slot="actions" onClick={handleSubmit(onFormSubmit)}>
        {t('ai_endpoints_token_deletion_confirm')}
      </Button>
    </OsdsModal>
  );
}
