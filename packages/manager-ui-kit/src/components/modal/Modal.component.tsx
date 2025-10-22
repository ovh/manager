import { ElementRef, ForwardedRef, forwardRef, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Modal as OdsModal,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ModalProps } from './Modal.props';

export const Modal = forwardRef(
  (
    {
      heading,
      type = MODAL_COLOR.information,
      loading,
      primaryButton,
      secondaryButton,
      onOpenChange,
      dismissible = true,
      open = true,
      children,
      step,
    }: ModalProps,
    ref: ForwardedRef<ElementRef<typeof ModalContent>>,
  ) => {
    const { t } = useTranslation(NAMESPACES.FORM);
    const buttonColor = useMemo(
      () => (type === MODAL_COLOR.critical ? MODAL_COLOR.critical : MODAL_COLOR.primary),
      [type],
    );

    return (
      <OdsModal data-testid="modal" onOpenChange={onOpenChange} open={open}>
        <ModalContent color={MODAL_COLOR[type]} dismissible={!!dismissible}>
          <ModalBody ref={ref} className="text-left">
            {heading && (
              <div className="flex items-center mb-4">
                <Text className="block mr-3 flex-1" preset={TEXT_PRESET.heading4}>
                  {heading}
                </Text>
                {Number.isInteger(step?.current) && Number.isInteger(step?.total) && (
                  <Text
                    className="ml-auto"
                    preset={TEXT_PRESET.caption}
                    data-testid="step-placeholder"
                  >
                    {t('stepPlaceholder', {
                      current: step.current,
                      total: step.total,
                    })}
                  </Text>
                )}
              </div>
            )}
            {loading && (
              <div data-testid="spinner" className="flex justify-center my-5">
                <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
              </div>
            )}
            {!loading && (
              <>
                <div className="flex flex-col text-left">{children}</div>
                <div className="flex justify-end flex-wrap gap-4">
                  {secondaryButton?.label && (
                    <Button
                      data-testid={secondaryButton.testId || 'secondary-button'}
                      color={buttonColor}
                      onClick={() => {
                        if (!secondaryButton.disabled) {
                          secondaryButton.onClick?.();
                        }
                      }}
                      disabled={secondaryButton.disabled}
                      loading={secondaryButton.loading}
                      variant={BUTTON_VARIANT.ghost}
                      className="mt-4"
                    >
                      {secondaryButton.label}
                    </Button>
                  )}
                  {primaryButton?.label && (
                    <Button
                      data-testid={primaryButton.testId || 'primary-button'}
                      color={buttonColor}
                      onClick={() => {
                        if (!primaryButton.disabled) {
                          primaryButton.onClick?.();
                        }
                      }}
                      disabled={primaryButton.disabled}
                      loading={primaryButton.loading}
                      variant={BUTTON_VARIANT.default}
                      className="mt-4"
                    >
                      {primaryButton.label}
                    </Button>
                  )}
                </div>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </OdsModal>
    );
  },
);
