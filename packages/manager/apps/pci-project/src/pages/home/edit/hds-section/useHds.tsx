import { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { PCI_HDS_ADDON } from '@/constants';
import { addOptionToCart, assignCart, createCart } from '@/data/api/cart';
import { getCartServiceOption, getServiceId, getServiceOptions } from '@/data/api/services';
import { TCartServiceOption, TServiceOption } from '@/data/models/Service.type';

/**
 * Check if project is already HDS certified
 * A project is certified if it has a service option with:
 * 1. Billing plan code match with PCI_HDS_ADDON.planCodeScope
 * 2. Resource product name matching PCI_HDS_ADDON.certifiedProject
 */
export const useIsAlreadyHdsCertifiedProject = (projectId?: string) =>
  useQuery({
    queryKey: ['isHdsCertified', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const serviceIds = await getServiceId(projectId as string);
      if (serviceIds?.length > 0 && serviceIds[0]) {
        return getServiceOptions(serviceIds[0]);
      }
      return [];
    },
    select: (serviceOptions: TServiceOption[]) => {
      const hasCertification = (option: TServiceOption): boolean => {
        const hasPlanCode = option.billing?.plan?.code.startsWith(PCI_HDS_ADDON.planCodeScope);
        const isProjectCertified =
          option.resource?.product?.name === PCI_HDS_ADDON.certifiedProject;

        return Boolean(hasPlanCode && isProjectCertified);
      };

      return serviceOptions?.some(hasCertification) ?? false;
    },
  });

export const useGetHdsCartServiceOption = (projectId?: string) =>
  useQuery({
    queryKey: ['/order/cartServiceOption/cloud', projectId],
    queryFn: () => getCartServiceOption(projectId as string),
    enabled: !!projectId,
    select: (cartServiceOption) =>
      cartServiceOption?.find(({ planCode }) => planCode.startsWith(PCI_HDS_ADDON.planCodeScope)),
  });

export const getPrepareHdsCartQueryKey = ({
  ovhSubsidiary,
  projectId,
  planCode,
}: {
  projectId: string;
  ovhSubsidiary?: string;
  planCode?: string;
}) => ['prepare-HDS-cart', projectId, ovhSubsidiary, planCode];

export const usePrepareHdsCart = ({
  projectId,
  cartServiceHDSOption,
  enabled = true,
}: {
  projectId: string;
  cartServiceHDSOption?: TCartServiceOption;
  enabled: boolean;
}) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useQuery({
    queryKey: getPrepareHdsCartQueryKey({
      projectId,
      ovhSubsidiary,
      planCode: cartServiceHDSOption?.planCode,
    }),
    queryFn: async () => {
      // 1. Create new cart
      const cart = await createCart(ovhSubsidiary);

      // 2. Assign cart
      await assignCart(cart.cartId);

      // 3. Find price mode with 'renew' capacity
      const priceMode = cartServiceHDSOption?.prices.find(({ capacities }) =>
        capacities.includes('renew'),
      );

      // 4. Add HDS option to cart
      await addOptionToCart(projectId, {
        cartId: cart.cartId,
        duration: `${priceMode?.duration}`,
        planCode: `${cartServiceHDSOption?.planCode}`,
        pricingMode: `${priceMode?.pricingMode}`,
        quantity: 1,
      });

      return cart;
    },
    enabled,
  });
};
