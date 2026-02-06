import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  ICON_NAME,
  Icon,
  SPINNER_SIZE,
  Spinner,
} from '@ovhcloud/ods-react';

import { Button } from '../../button/Button.component';
import '../translations';
import { DrawerBaseProps } from './DrawerBase.props';

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
          'w-full sm:w-(--mrc-drawer-width) max-w-full p-0 overflow-hidden',
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
              <div data-testid="drawer-spinner" className="h-full flex justify-center items-center">
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
