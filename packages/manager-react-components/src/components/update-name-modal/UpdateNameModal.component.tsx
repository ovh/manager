import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  MESSAGE_COLOR,
  ICON_NAME,
  Input,
  INPUT_TYPE,
  FormField,
  FormFieldLabel,
} from '@ovhcloud/ods-react';
import { Modal } from '../modal';
import { Text } from '../text';
import './translations/translations';
import { UpdateNameModalProps } from './UpdateNameModal.props';

export const UpdateNameModal: React.FC<UpdateNameModalProps> = ({
  headline,
  description,
  inputLabel,
  defaultValue,
  isLoading,
  onClose,
  updateDisplayName,
  error,
  cancelButtonLabel,
  confirmButtonLabel,
  pattern,
  patternMessage,
  isOpen = true,
}) => {
  const { t } = useTranslation('update-name-modal');
  const [displayName, setDisplayName] = useState(defaultValue);
  const [isPatternError, setIsPatternError] = useState(false);

  useEffect(() => {
    setDisplayName(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const regex = new RegExp(pattern || '');
    setIsPatternError(!displayName?.match(regex));
  }, [displayName, pattern]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      heading={headline}
      primaryButton={{
        label: confirmButtonLabel || t('updateModalConfirmButton'),
        onClick: () => updateDisplayName(displayName || ''),
      }}
      secondaryButton={{
        label: cancelButtonLabel || t('updateModalCancelButton'),
        onClick: handleClose,
      }}
    >
      <div>
        {!!error && (
          <Message color={MESSAGE_COLOR.critical}>
            <MessageIcon name={ICON_NAME.triangleExclamation} />
            <MessageBody>{t('updateModalError', { error })}</MessageBody>
          </Message>
        )}
        {description && (
          <Text className="pt-1 pb-3" preset={TEXT_PRESET.paragraph}>
            {description}
          </Text>
        )}
        <FormField>
          <FormFieldLabel htmlFor="update-name-modal-input">
            {inputLabel}
          </FormFieldLabel>
          <Input
            id="update-name-modal-input"
            aria-label="update-input"
            data-testid="update-name-modal-input"
            disabled={isLoading}
            type={INPUT_TYPE.text}
            value={displayName}
            invalid={isPatternError || undefined}
            onChange={(e) => setDisplayName(e.target.value)}
            aria-describedby={
              patternMessage ? 'update-name-modal-pattern-message' : undefined
            }
          />
          {patternMessage && (
            <Text
              id="update-name-modal-pattern-message"
              preset={TEXT_PRESET.span}
              className="text-right"
              style={{
                color:
                  isPatternError && pattern
                    ? 'var(--ods-color-critical-400)'
                    : 'var(--ods-color-text)',
              }}
            >
              {patternMessage}
            </Text>
          )}
        </FormField>
      </div>
    </Modal>
  );
};
