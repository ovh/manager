import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerBody,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  DRAWER_POSITION,
  Spinner,
  SPINNER_SIZE,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DrawerBaseProps } from './DrawerBase.props';
import '../translations';
import { Button } from '../../button/Button.component';

export const DrawerBase = ({
  children,
  createPortal,
  isOpen,
  isLoading,
  onDismiss,
  className,
  trigger,
}: DrawerBaseProps) => {
  const { t } = useTranslation('drawer');

  return (
    <Drawer open={isOpen} onOpenChange={onDismiss}>
      {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}
      <DrawerContent
        data-testid="drawer"
        createPortal={createPortal}
        position={DRAWER_POSITION.right}
        className={clsx(
          'w-full sm:w-[var(--mrc-drawer-width)] max-w-full p-0 overflow-hidden',
          className,
        )}
      >
        <DrawerBody>
          <div className="h-screen overflow-hidden flex flex-col justify-between">
            <Button
              data-testid="drawer-dismiss-button"
              aria-label={t('close')}
              onClick={onDismiss}
              color={BUTTON_COLOR.primary}
              variant={BUTTON_VARIANT.ghost}
              className="absolute top-7 right-4"
            >
              <Icon name={ICON_NAME.xmark} />
            </Button>

            {isLoading && (
              <div
                data-testid="drawer-spinner"
                className="h-full flex justify-center items-center"
              >
                <Spinner size={SPINNER_SIZE.md} />
              </div>
            )}
            {!isLoading && children}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
