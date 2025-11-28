import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOpenChangeDetail,
  DRAWER_POSITION,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (detail: DrawerOpenChangeDetail) => void;
}

export default function LoadingState({
  isOpen,
  onOpenChange,
}: LoadingStateProps) {
  const { t } = useTranslation(['domain']);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      closeOnEscape
      closeOnInteractOutside
    >
      <DrawerContent position={DRAWER_POSITION.right} className="min-w-[28rem]">
        <DrawerBody className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Spinner />
            <Text preset={TEXT_PRESET.heading5}>
              {t(
                'domain_tab_general_information_associated_services_hosting_order_loading',
              )}
            </Text>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
