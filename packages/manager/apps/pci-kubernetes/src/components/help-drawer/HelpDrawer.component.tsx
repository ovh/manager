import { PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerProp,
  DrawerTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type HelperDrawerProps = PropsWithChildren<DrawerProp>;

const HelpDrawer = ({ children, onOpenChange }: HelperDrawerProps) => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'common']);

  return (
    <>
      <div className="h-[25px] w-px bg-[var(--ods-color-information-800)]" />
      <Drawer closeOnEscape closeOnInteractOutside onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            {t('common:common_help')}
          </Button>
        </DrawerTrigger>
        <DrawerContent position={DRAWER_POSITION.right}>
          <DrawerBody className="pb-10">{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { HelpDrawer };
