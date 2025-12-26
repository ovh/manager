import { useTranslation } from 'react-i18next';
import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  Icon,
  DrawerOpenChangeDetail,
  DrawerProp,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PropsWithChildren, useState } from 'react';

type HelperDrawerProps = PropsWithChildren<DrawerProp> &
  React.HTMLAttributes<HTMLDivElement>;

export const HelpDrawer = ({ children, onOpenChange }: HelperDrawerProps) => {
  const { t } = useTranslation([
    NAMESPACES.ONBOARDING,
    NAMESPACES.ACTIONS,
    'common',
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    onOpenChange?.({ open });
    setIsOpen(open);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="h-[25px] w-px bg-[var(--ods-color-information-800)]" />
      <Drawer
        closeOnEscape
        closeOnInteractOutside
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            {t('common:pci_instances_common_help')}
          </Button>
        </DrawerTrigger>

        <DrawerContent
          position={DRAWER_POSITION.right}
          className="flex h-[unset] w-[450px] max-w-[90vw] flex-col justify-between p-6"
        >
          <DrawerBody className="flex flex-col pb-3">
            <Button
              aria-label={t('close')}
              variant="ghost"
              size="sm"
              className="self-end"
              onClick={handleClose}
            >
              <Icon name="xmark" />
            </Button>
            {children}
          </DrawerBody>

          <Button
            variant="ghost"
            className="flex self-start px-5"
            onClick={handleClose}
          >
            {t(`${NAMESPACES.ACTIONS}:close`)}
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};
