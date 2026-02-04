import { useContext } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { Link, MESSAGE_COLOR, Message, MessageBody } from '@ovhcloud/ods-react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { Order } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { isDefaultBandwidthOption } from '@ovh-ux/manager-network-common';

import { getUpgradedBandwidth } from '@/data/api/get/upgradedBandwidth';
import {
  addVrackBandwidthToCart,
  assignCart,
  checkoutCart,
  createCart,
} from '@/data/api/post/cart';
import { UpgradeBandwidthResponse, postUpgradeBandwidth } from '@/data/api/post/upgradeBandwidth';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export function useUpgradeBandwidth({
  serviceName,
  currentBandwidthLimit,
  region,
  onSuccess,
  onError,
}: {
  serviceName: string;
  currentBandwidthLimit: number;
  region: string;
  onSuccess?: (response: { order: Order } | UpgradeBandwidthResponse) => void;
  onError?: (error: ApiError | Error) => void;
}) {
  const { environment } = useContext(ShellContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.publicIpRouting);
  const { addSuccess } = useNotifications();

  return useMutation({
    mutationFn: async ({ planCode }: { planCode: string }) => {
      if (isDefaultBandwidthOption({ bandwidthLimit: currentBandwidthLimit, region })) {
        const cartResponse = await createCart(environment.user.ovhSubsidiary);
        await assignCart(cartResponse.data.cartId);
        await addVrackBandwidthToCart({
          cartId: cartResponse.data.cartId,
          serviceName,
          planCode,
        });
        const orderResponse = await checkoutCart(cartResponse.data.cartId);
        return { order: orderResponse.data };
      }

      const upgradedServiceList = await getUpgradedBandwidth();
      const upgradedService = upgradedServiceList.data.find(
        (option) => option.includes(serviceName) && option.includes(region),
      );

      if (!upgradedService) {
        throw new Error('No upgraded bandwidth option found for this service');
      }

      const order = await postUpgradeBandwidth({ serviceName: upgradedService, planCode });
      return order.data;
    },
    onSuccess: (response) => {
      onSuccess?.(response);
      window.open(response.order.url, '_blank', 'noopener,noreferrer');
      addSuccess(
        <Message className="my-3" color={MESSAGE_COLOR.success} dismissible={false}>
          <MessageBody className="block">
            <Trans
              t={t}
              i18nKey="publicIpRouting_success_order_message"
              components={{
                Link: (
                  <Link
                    onClick={() => {
                      window.open(response.order.url, '_blank', 'noopener,noreferrer');
                    }}
                  />
                ),
              }}
            />
          </MessageBody>
        </Message>,
        true,
      );
    },
    onError,
  });
}
