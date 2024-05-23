import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsText,
  OsdsInput,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
  OsdsButton,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';

export type UpdateNameModalProps = {
  headline: string;
  description?: string;
  inputLabel: string;
  defaultValue?: string;
  closeModal: () => void;
  updateDisplayName: (newDisplayName: string) => void;
  isLoading?: boolean;
  error?: string;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
};

export const UpdateNameModal: React.FC<UpdateNameModalProps> = ({
  headline,
  description,
  inputLabel,
  defaultValue,
  closeModal,
  isLoading,
  updateDisplayName,
  error,
  cancelButtonLabel,
  confirmButtonLabel,
}) => {
  const { t } = useTranslation('update-name-modal');
  const [displayName, setDisplayName] = React.useState(defaultValue);

  React.useEffect(() => {
    setDisplayName(defaultValue);
  }, [defaultValue]);

  return (
    <OsdsModal dismissible headline={headline} onOdsModalClose={closeModal}>
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('updateModalError', { error })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block my-4"
      >
        {description}
      </OsdsText>
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            className="block mb-3"
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
          >
            {inputLabel}
          </OsdsText>
        </div>
        <OsdsInput
          aria-label="update-input"
          disabled={isLoading || undefined}
          type={ODS_INPUT_TYPE.text}
          value={displayName}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDisplayName(e.detail.value)
          }
        />
      </OsdsFormField>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
      >
        {cancelButtonLabel || t('updateModalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => updateDisplayName(displayName))}
      >
        {confirmButtonLabel || t('updateModalConfirmButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
