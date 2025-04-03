import { useMe, useNotifications } from '@ovh-ux/manager-react-components';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useState } from 'react';
import { Translation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { checkoutCart, createAndAssignCart } from '@/api/data/cart';
import { orderQuota } from '@/api/data/quota';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';
import { Modal } from '@/components/Modal.component';
import { TRACK } from '@/constants';

export default function IncreaseQuotaPage(): JSX.Element {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { me } = useMe();
  const { addSuccess, addError } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => navigate('..');

  const { trackClick, trackPage } = useTracking();

  const { data: serviceOptions } = useGetFilteredServiceOptions(projectId);

  const onConfirm = async (formData: string) => {
    const planCode = formData || 'quota-no-plan';

    const serviceOption = serviceOptions?.find((s) => s.planCode === planCode);

    if (!serviceOptions) {
      trackPage({
        name: `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.ERROR}::${planCode}`,
      });
      addError(
        <Translation ns="quotas/increase">
          {(_t) =>
            _t('pci_projects_project_quota_increase_error_message', {
              message: '',
            })
          }
        </Translation>,
      );
    } else {
      setIsLoading(true);
      trackClick({
        name: `${TRACK.BASE}::${TRACK.SELECT_PLAN}::${TRACK.CONFIRM}_${planCode}`,
        type: 'action',
      });
      try {
        const cartId = await createAndAssignCart(me.ovhSubsidiary);
        const targetInstallationPrice = serviceOption?.prices?.find((price) =>
          price.capacities.includes('installation'),
        );
        await orderQuota(
          projectId,
          cartId,
          serviceOption?.planCode,
          targetInstallationPrice?.duration,
          targetInstallationPrice?.pricingMode,
        );
        const { url } = await checkoutCart(cartId);
        addSuccess(
          <Translation ns="quotas/increase">
            {(_t) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: _t(
                    'pci_projects_project_quota_increase_buy_success_message',
                    {
                      billingUrl: url,
                    },
                  ),
                }}
              ></span>
            )}
          </Translation>,
        );
        goBack();
      } catch (e) {
        trackPage({
          name: `${TRACK.BASE_SELECT_PLAN_BANNER}::${TRACK.SUCCESS}::${planCode}`,
        });
        addError(
          <Translation ns="quotas/increase">
            {(_t) =>
              _t('pci_projects_project_quota_increase_error_message', {
                message: e.data?.message,
              })
            }
          </Translation>,
        );
        goBack();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return <Modal onConfirm={onConfirm} isLoading={isLoading} />;
}
