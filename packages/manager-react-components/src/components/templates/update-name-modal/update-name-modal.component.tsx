import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsButton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
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
  pattern?: string;
  patternMessage?: string;
  isOpen?: boolean;
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
  pattern,
  patternMessage,
  isOpen = false,
}) => {
  const { t } = useTranslation('update-name-modal');
  const [displayName, setDisplayName] = React.useState(defaultValue);
  const [isPatternError, setIsPatternError] = React.useState(false);

  React.useEffect(() => {
    setDisplayName(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    const regex = new RegExp(pattern || '');
    setIsPatternError(!displayName?.match(regex));
  }, [displayName, pattern]);

  return (
    <OdsModal isOpen={isOpen} onOdsClose={closeModal}>
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3}>{headline}</OdsText>
        {!!error && (
          <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
            {t('updateModalError', { error })}
          </OdsMessage>
        )}
        {description && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>{description}</OdsText>
        )}
        <OdsFormField>
          <label slot="label" htmlFor="update-name-modal-input">
            {inputLabel}
          </label>
          <OdsInput
            className="block"
            aria-label="update-input"
            id="update-name-modal-input"
            name="update-name-modal-input"
            isDisabled={isLoading}
            type={ODS_INPUT_TYPE.text}
            value={displayName}
            hasError={isPatternError || undefined}
            onOdsChange={(e) => setDisplayName(e.detail.value as string)}
          />
          {patternMessage && (
            <OdsText
              slot="visual-hint"
              preset="span"
              className={`update-name-modal-pattern-message ${
                isPatternError && pattern ? 'error' : ''
              }`}
            >
              {patternMessage}
            </OdsText>
          )}
        </OdsFormField>
        <div className="flex justify-end gap-2">
          <OdsButton
            slot="actions"
            variant={ODS_BUTTON_VARIANT.ghost}
            {...handleClick(closeModal)}
            label={cancelButtonLabel || t('updateModalCancelButton')}
          />
          <OdsButton
            isDisabled={
              isPatternError || defaultValue === displayName || undefined
            }
            slot="actions"
            isLoading={isLoading}
            {...handleClick(() => updateDisplayName(displayName || ''))}
            label={confirmButtonLabel || t('updateModalConfirmButton')}
          />
        </div>
      </div>
    </OdsModal>
  );
};
