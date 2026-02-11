import { useContext, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Button,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  ICON_NAME,
  Icon,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Spinner,
  Text,
  Tile,
  toast,
} from '@ovhcloud/ods-react';
import type { DrawerOpenChangeDetail } from '@ovhcloud/ods-react';

import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useLoadBalancerFlavors } from '@/data/hooks/loadBalancerFlavor/useLoadBalancerFlavors';
import { useResizeLoadBalancerFlavor } from '@/data/hooks/loadBalancerFlavor/useResizeLoadBalancerFlavor';

import { selectLoadBalancerFlavors } from '../view-model/selectLoadBalancerFlavors';

export type ResizeLoadBalancerDrawerProps = {
  isOpen: boolean;
  selectedFlavorId: string;
  onDismiss: () => void;
};

export default function ResizeLoadBalancerDrawer({
  isOpen,
  selectedFlavorId,
  onDismiss,
}: ResizeLoadBalancerDrawerProps) {
  const { t } = useTranslation('load-balancer/overview');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { projectId, region, loadBalancerId } = useParams();
  const { getTextPrice } = useCatalogPrice(4);
  const { loadBalancerFlavors, isPending } = useLoadBalancerFlavors({
    projectId,
    region,
    ovhSubsidiary,
    select: selectLoadBalancerFlavors,
  });

  const [selectedSizeId, setSelectedSizeId] = useState<string>(selectedFlavorId);

  const handleOpenChange = (detail: DrawerOpenChangeDetail) => {
    if (!detail.open) onDismiss();
  };

  const handleSuccess = () => {
    toast.primary(
      t('load-balancer/overview:octavia_load_balancer_resize_drawer.resize_in_progress'),
      { icon: ICON_NAME.circleInfo, duration: Infinity, dismissible: true },
    );
    onDismiss();
  };

  const handleError = (errorMessage: string) => {
    toast.critical(errorMessage, { duration: Infinity, dismissible: true });
    onDismiss();
  };

  const { mutate: resizeLoadBalancerFlavor, isPending: isResizingLoadBalancerFlavor } =
    useResizeLoadBalancerFlavor({
      projectId,
      region,
      loadBalancerId,
      callbacks: { onSuccess: handleSuccess, onError: handleError },
    });

  const handleSubmit = () => {
    if (isResizingLoadBalancerFlavor) return;

    if (selectedSizeId === selectedFlavorId) {
      onDismiss();
      return;
    }

    resizeLoadBalancerFlavor({
      flavorId: selectedSizeId,
    });
  };

  return (
    <Drawer closeOnEscape closeOnInteractOutside open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent
        position={DRAWER_POSITION.right}
        className="flex h-[unset] w-[450px] max-w-[90vw] flex-col justify-between"
      >
        <DrawerBody className="flex flex-col p-6">
          <div className="flex items-start justify-between">
            <Text preset="heading-3">
              {t('load-balancer/overview:octavia_load_balancer_overview_config_modify_size')}
            </Text>
            <Button
              aria-label={t('load-balancer/overview:octavia_load_balancer_resize_drawer.close')}
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              <Icon name="xmark" />
            </Button>
          </div>

          <Text preset="paragraph" className="my-6">
            {t('load-balancer/overview:octavia_load_balancer_resize_drawer.description')}
          </Text>

          {isPending ? (
            <Spinner className="flex justify-center mt-4" size="lg" />
          ) : (
            <RadioGroup
              value={selectedSizeId}
              onValueChange={({ value }) => value && setSelectedSizeId(value)}
              aria-label={t('load-balancer/overview:octavia_load_balancer_overview_config_size')}
            >
              {loadBalancerFlavors.map(({ id, size, priceInUcents }) => (
                <Tile key={id} selected={selectedSizeId === id} className="mb-2">
                  <Radio value={id} className="justify-between w-full">
                    <div className="flex p-4 items-center gap-3">
                      <RadioControl />
                      <RadioLabel>
                        <Text preset="label">
                          {t(
                            `load-balancer/overview:octavia_load_balancer_resize_drawer.${size}_size_label`,
                          )}
                        </Text>
                      </RadioLabel>
                    </div>
                    <div className="flex flex-col items-end p-4">
                      <Text
                        as="span"
                        preset="heading-5"
                        className="font-semibold text-[--ods-color-primary-500]"
                      >
                        {getTextPrice(priceInUcents)}
                      </Text>
                      <Text preset="caption" className="text-[--ods-color-neutral-600]">
                        {t(
                          'load-balancer/overview:octavia_load_balancer_resize_drawer.billing_unit',
                        )}
                      </Text>
                    </div>
                  </Radio>
                </Tile>
              ))}
            </RadioGroup>
          )}
        </DrawerBody>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" onClick={onDismiss}>
            {t('load-balancer/overview:octavia_load_balancer_resize_drawer.cancel')}
          </Button>
          <Button
            loading={isResizingLoadBalancerFlavor}
            disabled={isResizingLoadBalancerFlavor}
            onClick={handleSubmit}
          >
            {t('load-balancer/overview:octavia_load_balancer_overview_config_modify_size')}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
