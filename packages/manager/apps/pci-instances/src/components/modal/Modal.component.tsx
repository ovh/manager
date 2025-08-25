import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Fragment, PropsWithChildren, useId } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Modal as ODSModal, ModalContent, Button } from '@ovhcloud/ods-react';

export type TModalVariant = 'primary' | 'warning' | 'critical';

const Modal = ({
  title,
  onModalClose,
  children,
  isPending,
  handleInstanceAction,
  variant = 'primary',
  dismissible = false,
  wrapper: Wrapper = Fragment,
}: {
  title: string;
  onModalClose: () => void;
  children: React.ReactNode;
  isPending: boolean;
  handleInstanceAction?: () => void;
  variant?: TModalVariant;
  dismissible?: boolean;
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
      >
        <Wrapper>
          <div id={id} className="px-8 pt-6 pb-10">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_TEXT_SIZE._400}
              hue={ODS_TEXT_COLOR_HUE._800}
              level={ODS_TEXT_LEVEL.heading}
            >
              {title}
            </OsdsText>
            {children}
          </div>
          <div className="flex justify-end p-8 pt-0 gap-4">
            <Button
              disabled={isPending}
              variant={'ghost'}
              color={'primary'}
              onClick={onModalClose}
            >
              {t('cancel')}
            </Button>
            <Button
              disabled={isPending}
              onClick={handleInstanceAction}
              color={'primary'}
              type={'submit'}
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
