import { type ChangeEvent, JSX, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';

import { Modal } from '@/components/modal/Modal.component';
import { Text } from '@/components/text/Text.component';
import type { UpdateNameModalProps } from '@/components/update-name-modal/UpdateNameModal.props';

import './translations/translations';

export function UpdateNameModal({
  headline,
  description,
  inputLabel,
  defaultValue = '',
  isLoading = false,
  onClose,
  updateDisplayName,
  onOpenChange,
  error,
  cancelButtonLabel,
  confirmButtonLabel,
  pattern,
  patternMessage,
  isOpen = true,
}: UpdateNameModalProps): JSX.Element {
  const { t } = useTranslation('update-name-modal');
  const [displayName, setDisplayName] = useState(defaultValue);
  const [isPatternError, setIsPatternError] = useState(false);

  useEffect(() => {
    setDisplayName(defaultValue ?? '');
  }, [defaultValue]);

  useEffect(() => {
    if (!pattern) {
      setIsPatternError(false);
      return;
    }
    try {
      const regex = new RegExp(pattern);
      setIsPatternError(!regex.test(displayName ?? ''));
    } catch {
      // If the regex is invalid, skip validation.
      setIsPatternError(false);
    }
  }, [displayName, pattern]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleClose = () => onClose?.();

  const handleConfirm = () => {
    updateDisplayName(displayName?.trim() ?? '');
  };

  return (
    <Modal
      open={isOpen}
      heading={headline}
      primaryButton={{
        label: confirmButtonLabel ?? t('updateModalConfirmButton'),
        onClick: handleConfirm,
        disabled: isPatternError || isLoading,
      }}
      secondaryButton={{
        label: cancelButtonLabel ?? t('updateModalCancelButton'),
        onClick: handleClose,
      }}
      onOpenChange={onOpenChange}
    >
      <div>
        {error && (
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
          <FormFieldLabel htmlFor="update-name-modal-input">{inputLabel}</FormFieldLabel>

          <Input
            id="update-name-modal-input"
            aria-label="update-input"
            data-testid="update-name-modal-input"
            disabled={isLoading}
            type={INPUT_TYPE.text}
            value={displayName ?? ''}
            invalid={isPatternError || undefined}
            onChange={handleChange}
            aria-describedby={patternMessage ? 'update-name-modal-pattern-message' : undefined}
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
}

UpdateNameModal.displayName = 'UpdateNameModal';
