import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';
import {
  useActivateProject,
  useClaimVoucher,
  useSimulateProjectActivation,
} from '@/data/hooks/useProjectActivation';
import { useServiceIds } from '@/data/hooks/useServices';
import { TEligibilityVoucher } from '@/data/types/payment/eligibility.type';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ProjectActivationResponse } from '@/data/api/project-activation';
import { TPrice } from '@/data/types/payment/cart.type';

export type UseProjectActivationProps = {
  promotionVoucher: TEligibilityVoucher['credit'] | null;
};

export const useProjectActivation = ({
  promotionVoucher,
}: Readonly<UseProjectActivationProps>) => {
  const { t } = useTranslation(['activate', NAMESPACES.ACTIONS]);

  const projectId = useProjectIdFromParams();

  const { data: serviceIds } = useServiceIds(projectId);
  const serviceId = serviceIds?.[0];

  const navigate = useNavigate();
  const { addError } = useNotifications();

  const [creditPaymentAmount, setCreditPaymentAmount] = useState<TPrice | null>(
    null,
  );

  const handleError = (error: ApiError) => {
    addError(
      t('pci_projects_project_activate_message_fail', {
        message: error?.response?.data?.message || error.message,
      }),
    );
  };

  /**
   * Hook to claim a voucher for a project
   */
  const {
    mutateAsync: claimVoucherAsync,
    isPending: isClaimingVoucher,
  } = useClaimVoucher();

  /**
   * Hook to activate a discovery project
   */
  const {
    mutateAsync: activateDiscoveryProjectAsync,
    isPending: isActivatingDiscoveryProject,
  } = useActivateProject({
    onError: handleError,
  });

  /**
   * Hook to simulate a discovery project activation
   */
  const {
    mutateAsync: simulateDiscoveryProjectActivationAsync,
    isPending: isSimulatingDiscoveryProjectActivation,
  } = useSimulateProjectActivation({
    onError: handleError,
  });

  /**
   * Main activation handler - orchestrates the entire flow
   */
  const handleActivateProject = async () => {
    try {
      // Step 1: Claim voucher if we have a promotion amount
      if (promotionVoucher) {
        await claimVoucherAsync({
          projectId,
          voucherCode: DISCOVERY_PROMOTION_VOUCHER,
        });
      }

      // Step 2: Simulate activation to check if payment is required
      const simulationResult = await simulateDiscoveryProjectActivationAsync(
        serviceId!,
      );

      // Step 3: Check if credit payment is needed
      if (simulationResult.order.prices.withTax.value !== 0) {
        // User needs to add credit - show the credit payment amount
        setCreditPaymentAmount(simulationResult.order.prices.withoutTax);
        return;
      }

      // Step 4: Proceed with activation (no payment required)
      const activationResult = await activateDiscoveryProjectAsync(serviceId!);

      // Step 5: Handle post-activation navigation
      if (activationResult.order.url && window.top) {
        // Redirect to payment URL if order.url is provided
        window.top.location.href = activationResult.order.url;
      } else {
        // Navigate to creating/updating page
        navigate(
          `../creating/${activationResult.order.orderId}/${DISCOVERY_PROMOTION_VOUCHER}`,
        );
      }
    } catch (error) {
      // Error is already handled by onError callbacks
      console.error('Project activation failed:', error);
    }
  };

  /**
   * Handler for credit payment flow (when user needs to pay)
   */
  const handleCreditPayment = async () => {
    try {
      // Activate with autoPay=false to get payment URL
      const activationResult = await activateDiscoveryProjectAsync(serviceId!);

      if (activationResult.order.url && window.top) {
        window.top.location.href = activationResult.order.url;
      } else {
        navigate(
          `../creating/${activationResult.order.orderId}/${DISCOVERY_PROMOTION_VOUCHER}`,
        );
      }
    } catch (error) {
      console.error('Credit payment activation failed:', error);
    }
  };

  const isSubmitting = [
    isClaimingVoucher,
    isSimulatingDiscoveryProjectActivation,
    isActivatingDiscoveryProject,
  ].some((isPending) => isPending);

  return {
    handleActivateProject,
    handleCreditPayment,
    isSubmitting,
    creditPaymentAmount,
    needsCreditPayment: creditPaymentAmount !== null,
  };
};
