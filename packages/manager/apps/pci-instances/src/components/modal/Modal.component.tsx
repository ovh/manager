import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useId } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Modal as ODSModal,
  ModalContent,
  Text,
  TEXT_PRESET,
  ModalProp,
} from '@ovhcloud/ods-react';

export type TModalVariant = 'primary' | 'warning' | 'critical';

type TModalProps = ModalProp & {
  title: string;
  onModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction: () => void;
  variant?: TModalVariant;
  dismissible?: boolean;
  disabled?: boolean;
};

const Modal = ({
  title,
  onModalClose,
  children,
  isPending,
  handleInstanceAction,
  variant = 'primary',
  dismissible = false,
  disabled,
  ...props
}: TModalProps) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const id = useId();

  return (
    <ODSModal
      {...('open' in props ? { open: props.open } : { defaultOpen: true })}
      onOpenChange={onModalClose}
      closeOnInteractOutside
      closeOnEscape
    >
      <ModalContent
        {...(variant === 'warning' && { color: 'warning' })}
        aria-describedby={id}
        dismissible={dismissible}
      >
        <div id={id} className="px-8 pt-6 pb-10">
          <Text preset={TEXT_PRESET.heading4}>{title}</Text>
          {children}
        </div>
        <div className="flex justify-end p-8 pt-0 gap-4">
          <Button
            disabled={isPending}
            variant={BUTTON_VARIANT.ghost}
            color={BUTTON_COLOR.primary}
            onClick={onModalClose}
          >
            {t('cancel')}
          </Button>
          <Button
            disabled={isPending || disabled}
            onClick={handleInstanceAction}
            color={BUTTON_COLOR.primary}
          >
            {t('confirm')}
          </Button>
        </div>
      </ModalContent>
    </ODSModal>
  );
};

export default Modal;
