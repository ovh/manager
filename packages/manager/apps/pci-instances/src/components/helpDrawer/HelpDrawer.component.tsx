import { useTranslation } from 'react-i18next';
import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerProp,
  DrawerTrigger,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PropsWithChildren } from "react";

type HelperDrawerProps = PropsWithChildren<DrawerProp> & React.HTMLAttributes<HTMLDivElement>;

export const HelpDrawer = ({ children }: HelperDrawerProps) => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'common']);

  return (
    <>
      <div className="w-px bg-[var(--ods-color-information-800)] h-[25px]"/>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            {t('common:pci_instances_common_help')}
          </Button>
        </DrawerTrigger>
        <DrawerContent position={DRAWER_POSITION.right}>
          <DrawerBody className="pb-10">
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
