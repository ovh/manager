import { Dispatch, SetStateAction, useState } from 'react';
import { PCI_HDS_ADDON } from '@/constants';
import {
  useAddItemToCart,
  useGetHdsAddonOption,
  useRemoveItemFromCart,
} from '@/data/hooks/useCart';
import { OrderedProduct } from '@/data/types/cart.type';
import {
  useIsAValidHdsSupportLevel,
  useIsHdsFeatureAvailabilityEnabled,
} from '@/hooks/useHds/useHds';
import { ConfigFormState } from './useConfigForm';

export type UseHdsManagementProps = {
  cartId: string;
  projectItemId: number;
  setForm: Dispatch<SetStateAction<ConfigFormState>>;
};

export const useHdsManagement = ({
  cartId,
  projectItemId,
  setForm,
}: UseHdsManagementProps) => {
  const [hdsItem, setHdsItem] = useState<OrderedProduct | null>(null);

  const isHdsFeatureAvailabilityEnabled = useIsHdsFeatureAvailabilityEnabled();
  const isAValidHdsSupportLevel = useIsAValidHdsSupportLevel();

  const shouldDisplayHdsSection =
    isHdsFeatureAvailabilityEnabled && isAValidHdsSupportLevel;

  // Get HDS addon option for dynamic pricing
  const { data: hdsAddonOption } = useGetHdsAddonOption(cartId);

  const { mutate: addHdsToCart, isPending: isAddingHds } = useAddItemToCart({
    onSuccess: (item: OrderedProduct) => setHdsItem(item),
    onError: () => {
      // Revert HDS state on failure (like AngularJS version)
      setForm((prev) => ({ ...prev, isHdsChecked: false }));
    },
  });

  const {
    mutate: removeHdsFromCart,
    isPending: isRemovingHds,
  } = useRemoveItemFromCart({
    onSuccess: () => setHdsItem(null),
    onError: () => {
      // On error removing HDS, revert the checkbox state
      setForm((prev) => ({ ...prev, isHdsChecked: true }));
    },
  });

  const isHdsPending = isAddingHds || isRemovingHds;

  const handleHdsToggle = (isChecked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isHdsChecked: isChecked,
      isContractsChecked: false,
    }));

    if (isChecked && !hdsItem) {
      // Find the price mode with 'renew' capacity
      const priceMode = hdsAddonOption?.prices.find(({ capacities }) =>
        capacities.includes('renew'),
      );

      addHdsToCart({
        cartId,
        item: {
          duration: priceMode?.duration || 'P1M',
          itemId: projectItemId,
          planCode: PCI_HDS_ADDON.planCode,
          pricingMode: priceMode?.pricingMode || 'default',
          quantity: 1,
        },
      });
    } else if (!isChecked && hdsItem) {
      removeHdsFromCart({
        cartId: hdsItem.cartId,
        itemId: hdsItem.itemId,
      });
    }
  };

  return {
    shouldDisplayHdsSection,
    isHdsPending,
    handleHdsToggle,
  };
};
