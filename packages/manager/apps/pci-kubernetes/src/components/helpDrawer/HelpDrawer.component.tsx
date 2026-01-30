import { PropsWithChildren, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOpenChangeDetail,
  DrawerProp,
  DrawerTrigger,
  Icon,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type HelperDrawerProps = PropsWithChildren<DrawerProp> & {
  headerContent?: string;
};
export const HelpDrawer = ({ children, onOpenChange, headerContent }: HelperDrawerProps) => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, NAMESPACES.ACTIONS, 'common']);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    onOpenChange?.({ open });
    setIsOpen(open);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer closeOnEscape closeOnInteractOutside open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          {t('common:common_help')}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        position={DRAWER_POSITION.right}
        className="flex h-[unset] w-[450px] max-w-[90vw] flex-col justify-between p-8"
      >
        <DrawerBody className="flex flex-col pb-3">
          <div className="mb-10 flex items-center justify-between gap-3">
            {headerContent && <Text preset="heading-3">{headerContent}</Text>}
            <Button aria-label={t('close')} variant="ghost" size="sm" onClick={handleClose}>
              <Icon name="xmark" />
            </Button>
          </div>
          {children}
        </DrawerBody>

        <Button variant="ghost" className="flex self-start px-5" onClick={handleClose}>
          {t(`${NAMESPACES.ACTIONS}:close`)}
        </Button>
      </DrawerContent>
    </Drawer>
  );
};
