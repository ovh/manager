import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Link, MESSAGE_COLOR, Message, MessageBody } from '@ovhcloud/ods-react';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { DEFAULT_BANDWIDTH_PLAN_CODE } from '@ovh-ux/manager-network-common';
import { useNotifications } from '@ovh-ux/muk';

import { terminateService } from '@/data/api/delete/terminateService';
import {
  getUpgradedBandwidth,
  getUpgradedBandwidthServiceId,
} from '@/data/api/get/upgradedBandwidth';
import { UpgradeBandwidthResponse, postUpgradeBandwidth } from '@/data/api/post/upgradeBandwidth';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export function useDowngradeBandwidth({
  serviceName,
  region,
  onSuccess,
  onError,
}: {
  serviceName: string;
  region: string;
  onSuccess?: (response: ApiResponse<void | UpgradeBandwidthResponse>) => void;
  onError?: (error: ApiError | Error) => void;
}) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.publicIpRouting);
  const { addSuccess } = useNotifications();

  return useMutation({
    mutationFn: async ({ planCode }: { planCode: string }) => {
      const upgradedServiceList = await getUpgradedBandwidth();

      const upgradedService = upgradedServiceList.data.find(
        (option) => option.includes(serviceName) && option.includes(region),
      );

      if (!upgradedService) {
        throw new Error('No upgraded bandwidth option found for this service');
      }

      if (planCode === DEFAULT_BANDWIDTH_PLAN_CODE) {
        const serviceResponse = await getUpgradedBandwidthServiceId(upgradedService);
        const serviceId = serviceResponse.data[0];

        if (!serviceId) {
          throw new Error('No service found for this upgraded bandwidth option');
        }

        // TODO: Replace with terminateServiceAtRenew when the API is fixed
        const result = await terminateService(serviceId);
        return result;
      }

      const order = await postUpgradeBandwidth({ serviceName: upgradedService, planCode });
      return order;
    },
    onSuccess: (response) => {
      onSuccess?.(response);
      if (response.data?.order?.url) {
        window.open(response.data.order.url, '_blank', 'noopener,noreferrer');
      }

      addSuccess(
        <Message className="my-3" color={MESSAGE_COLOR.success} dismissible={false}>
          <Icon name={ICON_NAME.check} />
          <MessageBody className="block">
            {response.data?.order?.url ? (
              <Trans
                t={t}
                i18nKey="publicIpRouting_success_order_message"
                components={{
                  Link: (
                    <Link
                      onClick={() => {
                        window.open(response.data?.order?.url, '_blank', 'noopener,noreferrer');
                      }}
                    />
                  ),
                }}
              />
            ) : (
              t('publicIpRouting_success_downgrade_to_default_bandwidth_message')
            )}
          </MessageBody>
        </Message>,
        true,
      );
    },
    onError,
  });
}
