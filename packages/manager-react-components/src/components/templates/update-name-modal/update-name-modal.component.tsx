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
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
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
    const regex = new RegExp(pattern);
    setIsPatternError(!displayName?.match(regex));
  }, [displayName, pattern]);

  return (
    <OdsModal isOpen={isOpen} onOdsClose={closeModal}>
      <div>
        <span className="update-name-headline text-[--ods-color-heading] text-[24px] leading-[32px] font-bold">
          {headline}
        </span>
      </div>
      {!!error && (
        <OdsMessage color={ODS_MESSAGE_COLOR.danger}>
          <OdsText preset="span">{t('updateModalError', { error })}</OdsText>
        </OdsMessage>
      )}
      <span className="update-name-description text-[--ods-color-text] text-[14px] leading-[18px] my-[8px]">
        {description}
      </span>
      <OdsFormField className="mb-8">
        <div slot="label">
          <span className="update-name-input-label text-[--ods-color-text] text-[14px] leading-[18px] font-semibold">
            {inputLabel}
          </span>
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
              preset="span"
              className={`update-name-modal-pattern-message ${
                isPatternError && pattern ? 'error' : ''
              }`}
            >
              {patternMessage}
            </OdsText>
          </div>
        )}
      </OdsFormField>
      <OdsButton
        isDisabled={isLoading}
        slot="actions"
        variant={ODS_BUTTON_VARIANT.ghost}
        {...handleClick(closeModal)}
        label={cancelButtonLabel || t('updateModalCancelButton')}
      />
      <OdsButton
        isDisabled={isPatternError}
        slot="actions"
        isLoading={isLoading}
        {...handleClick(() => updateDisplayName(displayName))}
        label={confirmButtonLabel || t('updateModalConfirmButton')}
      />
    </OdsModal>
  );
};
