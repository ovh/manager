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
  pattern?: string;
  patternMessage?: string;
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
    <OsdsModal dismissible headline={headline} onOdsModalClose={closeModal}>
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
      <OsdsFormField className="mb-8">
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
          error={isPatternError || undefined}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDisplayName(e.detail.value)
          }
        />
        {patternMessage && (
          <div className="mt-5">
            <OsdsText
              className="block"
              color={
                isPatternError && pattern
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.text
              }
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._100}
            >
              {patternMessage}
            </OsdsText>
          </div>
        )}
      </OsdsFormField>
      {isLoading && (
        <div className="flex justify-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
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
        disabled={
          isLoading ||
          isPatternError ||
          defaultValue === displayName ||
          undefined
        }
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
