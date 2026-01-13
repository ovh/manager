import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';
import { useClaimVoucher } from '@/data/hooks/useProjects';
import { useActivateProject, useSimulateProjectActivation } from '@/data/hooks/useServices';
import { TEligibilityVoucher } from '@/data/models/Eligibility.type';
import { TProjectPrice } from '@/data/models/Project.type';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';

import { useActivateTracking } from './useActivateTracking';

type ApiError = AxiosError<{ message: string }>;

export type UseProjectActivationProps = {
  promotionVoucher: TEligibilityVoucher['credit'] | null;
  serviceId?: number;
};

export const useProjectActivation = ({
  promotionVoucher,
  serviceId,
}: Readonly<UseProjectActivationProps>) => {
  const { t } = useTranslation(['activate', NAMESPACES.ACTIONS]);

  const projectId = useProjectIdFromParams();

  const navigate = useNavigate();
  const { addError } = useNotifications();
  const { trackActivateError, trackActivateSuccess } = useActivateTracking();

  const [creditPaymentAmount, setCreditPaymentAmount] = useState<TProjectPrice | null>(null);

  const { mutateAsync: claimDiscoveryVoucher, isPending: isClaimingDiscoveryVoucher } =
    useClaimVoucher();

  const { mutateAsync: activateDiscoveryProject, isPending: isActivatingDiscoveryProject } =
    useActivateProject();

  const {
    mutateAsync: simulateDiscoveryProjectActivation,
    isPending: isSimulatingDiscoveryProjectActivation,
  } = useSimulateProjectActivation();

  const navigateToUpdating = useCallback(
    (orderId: number) => {
      const path = promotionVoucher
        ? `../../updating/${orderId}/${DISCOVERY_PROMOTION_VOUCHER}`
        : `../../updating/${orderId}`;
      navigate(path);
    },
    [navigate, promotionVoucher],
  );

  const handleActivateProject = useCallback(
    async ({
      simulate = true,
      autoPay = true,
      claimVoucher = true,
    }: { simulate?: boolean; autoPay?: boolean; claimVoucher?: boolean } = {}) => {
      try {
        // Step 1: Claim voucher if we have a promotion amount
        if (promotionVoucher && claimVoucher) {
          await claimDiscoveryVoucher({
            projectId,
            voucherCode: DISCOVERY_PROMOTION_VOUCHER,
          });
        }

        // Step 2: Simulate activation to check if payment is required
        if (simulate) {
          const simulationResult = await simulateDiscoveryProjectActivation(serviceId!);

          // Step 3: Check if credit payment is needed
          if (simulationResult?.order?.prices?.withTax?.value !== 0) {
            setCreditPaymentAmount(simulationResult.order.prices.withoutTax);
            return;
          }
        }

        // Step 4: Proceed with activation (no payment required)
        const activationResult = await activateDiscoveryProject(serviceId!);

        // Step 5: Track successful activation
        trackActivateSuccess(DISCOVERY_PROMOTION_VOUCHER);

        // Step 6: Handle post-activation navigation
        if (!autoPay && activationResult.order.url && window.top) {
          // Redirect to payment URL if order.url is provided
          window.top.location.href = activationResult.order.url;
          return;
        }

        // Step 7: Navigate to updating page
        navigateToUpdating(activationResult.order.orderId);
      } catch (error) {
        trackActivateError(
          (error as ApiError)?.response?.data?.message || (error as Error).message,
        );
        addError(
          t('pci_projects_project_activate_message_fail', {
            message: (error as ApiError)?.response?.data?.message || (error as Error).message,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      claimDiscoveryVoucher,
      simulateDiscoveryProjectActivation,
      activateDiscoveryProject,
      navigateToUpdating,
      addError,
      promotionVoucher,
      serviceId,
      projectId,
    ],
  );

  /**
   * Handler for credit payment flow (when user needs to pay)
   */
  const handleCreditPayment = () => {
    void handleActivateProject({ autoPay: false, simulate: false, claimVoucher: false });
  };

  const isSubmitting =
    isClaimingDiscoveryVoucher ||
    isSimulatingDiscoveryProjectActivation ||
    isActivatingDiscoveryProject;

  return {
    handleActivateProject,
    handleCreditPayment,
    isSubmitting,
    creditPaymentAmount,
  };
};
