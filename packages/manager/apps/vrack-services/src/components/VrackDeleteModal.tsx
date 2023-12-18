import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import {
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components/input';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { handleClick } from '@/utils/ods-utils';
import { FormField } from './FormField';

export type VrackDeleteModalProps = {
  headline: string;
  description?: string;
  deleteInputLabel: string;
  isModalOpen?: boolean;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  error?: string;
};

const terminateValue = 'Terminate';

export const VrackDeleteModal: React.FC<VrackDeleteModalProps> = ({
  headline,
  description,
  isModalOpen,
  deleteInputLabel,
  closeModal,
  isLoading,
  onConfirmDelete,
  error,
}) => {
  const { t } = useTranslation('vrack-services');
  const [deleteInput, setDeleteInput] = React.useState('');
  const close = () => {
    setDeleteInput('');
    closeModal();
  };

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.warning}
      headline={headline}
      masked={!isModalOpen || undefined}
      onOdsModalClose={close}
    >
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', { error })}
        </OsdsMessage>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-3"
      >
        {description}
      </OsdsText>
      <FormField fullWidth label={deleteInputLabel}>
        <OsdsInput
          disabled={isLoading || undefined}
          type={ODS_INPUT_TYPE.text}
          value={deleteInput}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDeleteInput(e.detail.value)
          }
        />
      </FormField>
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(close)}
      >
        {t('modalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || deleteInput !== terminateValue || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => {
          setDeleteInput('');
          onConfirmDelete();
        })}
      >
        {t('modalDeleteButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
