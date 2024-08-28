import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsText,
  OdsInput,
  OdsMessage,
  OdsSpinner,
  OdsModal,
  OdsButton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';
import './update-name-modal.scss';

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
    const regex = new RegExp(pattern);
    if (displayName) {
      setIsPatternError(!displayName.match(regex));
    }
  }, [displayName, pattern]);

  return (
    <OdsModal isOpen={isOpen} onOdsClose={closeModal}>
      <div>
        <OdsText
          className="update-name-headline"
          preset={ODS_TEXT_PRESET.heading6}
        >
          {headline}
        </OdsText>
      </div>
      {!!error && (
        <OdsMessage color={ODS_MESSAGE_COLOR.danger}>
          <OdsText>{t('updateModalError', { error })}</OdsText>
        </OdsMessage>
      )}
      <OdsText className="update-name-description">{description}</OdsText>
      <OdsFormField className="mb-8">
        <div slot="label">
          <OdsText className="update-name-input-label">
            <b>{inputLabel}</b>
          </OdsText>
        </div>
        <OdsInput
          aria-label="update-input"
          isDisabled={isLoading}
          type={ODS_INPUT_TYPE.text}
          value={displayName}
          hasError={isPatternError || undefined}
          name="update-name-modal-input"
          onOdsChange={(e: OdsInputCustomEvent<OdsInputChangeEventDetail>) =>
            setDisplayName(e.detail.value as string)
          }
        />
        {patternMessage && (
          <div className="mt-5">
            <OdsText
              className={`update-name-modal-pattern-message ${
                isPatternError && pattern ? 'error' : ''
              }`}
            >
              {patternMessage}
            </OdsText>
          </div>
        )}
      </OdsFormField>
      {isLoading && (
        <div className="flex justify-center">
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      <OdsButton
        isDisabled={isLoading}
        slot="actions"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
        label={cancelButtonLabel || t('updateModalCancelButton')}
      />
      <OdsButton
        isDisabled={isLoading || isPatternError}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => updateDisplayName(displayName))}
        label={confirmButtonLabel || t('updateModalConfirmButton')}
      />
    </OdsModal>
  );
};
