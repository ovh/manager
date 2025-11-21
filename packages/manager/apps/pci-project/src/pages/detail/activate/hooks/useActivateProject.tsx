import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';

import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { useActivateTracking } from './useActivateTracking';
import {
  useActivateProject,
  useSimulateProjectActivation,
} from '@/data/hooks/useServices';
import { useClaimVoucher } from '@/data/hooks/useProjects';
import { TProjectPrice } from '@/data/types/project.type';
import { TEligibilityVoucher } from '@/data/types/eligibility.type';

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

  const [
    creditPaymentAmount,
    setCreditPaymentAmount,
  ] = useState<TProjectPrice | null>(null);

  const handleError = (error: ApiError) => {
    trackActivateError();
    addError(
      t('pci_projects_project_activate_message_fail', {
        message: error?.response?.data?.message || error.message,
      }),
    );
  };

  const {
    mutateAsync: claimDiscoveryVoucher,
    isPending: isClaimingDiscoveryVoucher,
  } = useClaimVoucher();

  const {
    mutateAsync: activateDiscoveryProject,
    isPending: isActivatingDiscoveryProject,
  } = useActivateProject();

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

  const handleActivateProject = async ({
    simulate = true,
    autoPay = true,
  }: { simulate?: boolean; autoPay?: boolean } = {}) => {
    try {
      // Step 1: Claim voucher if we have a promotion amount
      if (promotionVoucher) {
        await claimDiscoveryVoucher({
          projectId,
          voucherCode: DISCOVERY_PROMOTION_VOUCHER,
        });
      }

      // Step 2: Simulate activation to check if payment is required
      if (simulate) {
        const simulationResult = await simulateDiscoveryProjectActivation(
          serviceId!,
        );

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
      handleError(error as ApiError);
    }
  };

  /**
   * Handler for credit payment flow (when user needs to pay)
   */
  const handleCreditPayment = () => {
    handleActivateProject({ autoPay: false, simulate: false });
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
