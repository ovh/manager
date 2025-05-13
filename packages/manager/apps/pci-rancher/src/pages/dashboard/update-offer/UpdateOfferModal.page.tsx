import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useRancher } from '@/data/hooks/useRancher/useRancher';
import UpdateOfferModal from '@/components/Modal/UpdateOfferModal/UpdateOfferModal.component';
import { RancherPlanName } from '@/types/api.type';
import useEditRancher, {
  EditAction,
} from '@/data/hooks/useEditRancher/useEditRancher';
import { getRancherByIdUrl } from '@/utils/route';
import { useRancherPrices } from '@/hooks/useRancherPrices';

const UpdateOfferModalPage = () => {
  const { data: rancher } = useRancher({});
  const { projectId } = useParams();
  const { plansPricing } = useRancherPrices();
  const { getTextPrice } = useCatalogPrice(5);
  const { currentState } = rancher;
  const navigate = useNavigate();

  const planInfo = useMemo(() => {
    const plans = plansPricing.find((plan) => plan.name !== currentState.plan);
    return plans
      ? { name: plans.name, price: getTextPrice(plans.hourlyPrice) }
      : null;
  }, [plansPricing, currentState]);

  const { mutate, isPending } = useEditRancher({
    projectId,
    rancherId: rancher?.id,
  });

  const { plan: planName } = rancher.currentState;

  const togglePlan =
    planName === RancherPlanName.OVHCLOUD_EDITION
      ? RancherPlanName.STANDARD
      : RancherPlanName.OVHCLOUD_EDITION;

  const onClose = () => navigate(getRancherByIdUrl(projectId, rancher?.id));

  const onClickUpdateOffer = (plan: string) => {
    mutate({
      rancher: {
        targetSpec: {
          ...rancher.targetSpec,
          plan,
        },
      },
      editAction: EditAction.UpdateOffer,
    });
  };

  return (
    <UpdateOfferModal
      onClickUpdate={() => onClickUpdateOffer(togglePlan)}
      isUpdatePending={isPending}
      onClose={onClose}
      planInfo={planInfo}
    />
  );
};

export default UpdateOfferModalPage;
