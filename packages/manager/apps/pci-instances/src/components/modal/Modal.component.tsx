import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Fragment, PropsWithChildren, useId } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Modal as ODSModal,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';

export type TModalVariant = 'primary' | 'warning' | 'critical';

const Modal = ({
  title,
  onModalClose,
  children,
  isPending,
  handleInstanceAction,
  variant = 'primary',
  dismissible = false,
  disabled,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  wrapper: Wrapper = Fragment,
}: {
  title: string;
  onModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction?: () => void;
  variant?: TModalVariant;
  dismissible?: boolean;
  disabled?: boolean;
  wrapper?: React.ComponentType<PropsWithChildren<unknown>>;
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const id = useId();

  return (
    <ODSModal
      defaultOpen
      onOpenChange={onModalClose}
      closeOnInteractOutside
      closeOnEscape
    >
      <ModalContent
        {...(variant === 'warning' && { color: 'warning' })}
        aria-describedby={id}
        dismissible={dismissible}
        className="max-h-[unset]"
      >
        <Wrapper>
          <div id={id} className="px-8 pt-6 pb-10">
            <div id={id}>
              <Text preset={TEXT_PRESET.heading4}>{title}</Text>
              {children}
            </div>
          </div>
          <div className="flex justify-end p-8 pt-0 gap-4">
            <Button
              disabled={isPending}
              variant={BUTTON_VARIANT.ghost}
              color={BUTTON_COLOR.primary}
              onClick={onModalClose}
              type="button"
            >
              {t('cancel')}
            </Button>
            <Button
              disabled={isPending || disabled}
              onClick={handleInstanceAction}
              color={BUTTON_COLOR.primary}
              type="submit"
            >
              {t('confirm')}
            </Button>
          </div>
        </Wrapper>
      </ModalContent>
    </ODSModal>
  );
};

export default Modal;
