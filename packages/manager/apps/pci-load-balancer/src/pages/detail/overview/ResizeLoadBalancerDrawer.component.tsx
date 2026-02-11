import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  DRAWER_POSITION,
  Drawer,
  DrawerBody,
  DrawerContent,
  Icon,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  Tile,
} from '@ovhcloud/ods-react';
import type { DrawerOpenChangeDetail } from '@ovhcloud/ods-react';

const LOAD_BALANCER_SIZE_OPTIONS = [
  {
    id: 'medium',
    labelKey: 'octavia_load_balancer_overview_config_size_medium',
    descriptionKey: 'octavia_load_balancer_resize_drawer_size_m_description',
    price: '0,00000 €',
    billingUnitKey: 'octavia_load_balancer_resize_drawer_billing_unit',
  },
  {
    id: 'large',
    labelKey: 'octavia_load_balancer_overview_config_size_large',
    descriptionKey: 'octavia_load_balancer_resize_drawer_size_l_description',
    price: '0,00000 €',
    billingUnitKey: 'octavia_load_balancer_resize_drawer_billing_unit',
  },
  {
    id: 'xl',
    labelKey: 'octavia_load_balancer_overview_config_size_xl',
    descriptionKey: 'octavia_load_balancer_resize_drawer_size_xl_description',
    price: '0,00000 €',
    billingUnitKey: 'octavia_load_balancer_resize_drawer_billing_unit',
  },
  {
    id: '2xl',
    labelKey: 'octavia_load_balancer_resize_drawer_size_2xl',
    descriptionKey: 'octavia_load_balancer_resize_drawer_size_2xl_description',
    price: '0,00000 €',
    billingUnitKey: 'octavia_load_balancer_resize_drawer_billing_unit',
  },
] as const;

export type ResizeLoadBalancerDrawerProps = {
  isOpen: boolean;
  onDismiss: () => void;
};

export default function ResizeLoadBalancerDrawer({
  isOpen,
  onDismiss,
}: ResizeLoadBalancerDrawerProps) {
  const { t } = useTranslation('load-balancer/overview');
  const [selectedSizeId, setSelectedSizeId] = useState<string>(LOAD_BALANCER_SIZE_OPTIONS[0].id);

  const handleOpenChange = (detail: DrawerOpenChangeDetail) => {
    if (!detail.open) {
      onDismiss();
    }
  };

  const handleSubmit = () => {
    // Placeholder for future resize action
    onDismiss();
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
              aria-label={t('load-balancer/overview:octavia_load_balancer_resize_drawer_close')}
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              <Icon name="xmark" />
            </Button>
          </div>

          <Text preset="paragraph" className="my-6">
            {t('load-balancer/overview:octavia_load_balancer_resize_drawer_description')}
          </Text>

          <RadioGroup
            value={selectedSizeId}
            onValueChange={({ value }) => value && setSelectedSizeId(value)}
            aria-label={t('load-balancer/overview:octavia_load_balancer_overview_config_size')}
          >
            {LOAD_BALANCER_SIZE_OPTIONS.map((option) => (
              <Tile key={option.id} selected={selectedSizeId === option.id} className="mb-2">
                <Radio value={option.id} className="justify-between w-full">
                  <div className="flex p-4 items-center gap-3">
                    <RadioControl />
                    <RadioLabel>
                      <Text preset="label">{t(option.labelKey)}</Text>
                    </RadioLabel>
                  </div>
                  <div className="flex flex-col items-end p-4">
                    <Text
                      as="span"
                      preset="heading-5"
                      className="font-semibold text-[--ods-color-primary-500]"
                    >
                      {option.price}
                    </Text>
                    <Text preset="caption" className="text-[--ods-color-neutral-600]">
                      {t(option.billingUnitKey)}
                    </Text>
                  </div>
                </Radio>
              </Tile>
            ))}
          </RadioGroup>
        </DrawerBody>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" onClick={onDismiss}>
            {t('load-balancer/overview:octavia_load_balancer_resize_drawer_cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('load-balancer/overview:octavia_load_balancer_overview_config_modify_size')}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
