import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerOpenChangeDetail,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { UseMutateFunction } from '@tanstack/react-query';
import { FreeHostingOptions } from './Hosting';
import { TInitialOrderFreeHosting } from '@/domain/types/hosting';
import OfferSection from './FreeHostingDrawer/OfferSection';
import DnsSection from './FreeHostingDrawer/DnsSection';
import TarificationSection from './FreeHostingDrawer/TarificationSection';
import ActivationSection from './FreeHostingDrawer/ActivationSection';
import LoadingState from './FreeHostingDrawer/LoadingState';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface FreeHostingDrawerProps {
  readonly isDrawerOpen: boolean;
  readonly freeHostingOptions: FreeHostingOptions;
  readonly isInitialOrderFreeHostingPending: boolean;
  readonly isOrderFreeHostingPending: boolean;
  readonly orderCartDetails: TInitialOrderFreeHosting;
  readonly setFreeHostingOptions: React.Dispatch<
    React.SetStateAction<FreeHostingOptions>
  >;
  readonly onClose: () => void;
  readonly orderFreeHosting: UseMutateFunction<
    void,
    Error,
    {
      cartId: string;
      itemId: number;
      options: FreeHostingOptions;
    },
    unknown
  >;
}

export default function FreeHostingDrawer({
  isDrawerOpen,
  isOrderFreeHostingPending,
  isInitialOrderFreeHostingPending,
  freeHostingOptions,
  orderCartDetails,
  setFreeHostingOptions,
  orderFreeHosting,
  onClose,
}: FreeHostingDrawerProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  const handleOpenChange = ({ open }: DrawerOpenChangeDetail) => {
    if (!open) onClose();
  };

  const updateOption = (key: keyof FreeHostingOptions, value: boolean) => {
    setFreeHostingOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isOrderFreeHostingPending) {
    return (
      <LoadingState isOpen={isDrawerOpen} onOpenChange={handleOpenChange} />
    );
  }

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={handleOpenChange}
      closeOnEscape
      closeOnInteractOutside
    >
      <DrawerContent position={DRAWER_POSITION.right} className="min-w-[28rem]">
        <DrawerBody className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-8 py-8">
            {/* Title */}
            <Text preset={TEXT_PRESET.heading2}>
              {t(
                'domain_tab_general_information_associated_services_hosting_drawer_title',
              )}
            </Text>

            {/* Offer Section */}
            <OfferSection />

            {/* DNS Section */}
            <DnsSection onCheckedChange={updateOption} />

            {/* Tarification Section */}
            <TarificationSection />

            {/* Activation Section */}
            <ActivationSection
              isLoading={isInitialOrderFreeHostingPending}
              freeHostingOptions={freeHostingOptions}
              orderCartDetails={orderCartDetails}
              onCheckedChange={updateOption}
            />
          </div>
          {/* Footer Buttons */}
          <div className="flex gap-4 p-6 border-t flex-shrink-0 mb-6">
            <Button variant="ghost" onClick={onClose}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              variant="default"
              disabled={!freeHostingOptions.consent}
              onClick={() =>
                orderFreeHosting({
                  cartId: orderCartDetails?.cartId,
                  itemId: orderCartDetails?.details[0]?.cartItemID,
                  options: freeHostingOptions,
                })
              }
            >
              {t(`${NAMESPACES.ACTIONS}:validate`)}
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
