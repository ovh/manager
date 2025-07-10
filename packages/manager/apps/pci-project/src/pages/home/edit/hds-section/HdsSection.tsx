import { ApiError } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCartSummary } from '@/data/hooks/useCart';
import HdsOption from '@/components/hds-option/HdsOption';
import Contracts from '@/components/contracts/Contracts';
import {
  useGetHdsCartServiceOption,
  useIsAlreadyHdsCertifiedProject,
  usePrepareHdsCart,
} from './useHds';
import { useCheckoutWithFidelityAccount } from '@/hooks/useCheckout/useCheckout';

export default function HdsSection({ project }: { project: TProject }) {
  const { t } = useTranslation('hds');

  const { addSuccess, addError } = useNotifications();

  const [isHDSChecked, setIsHDSChecked] = useState(false);
  const [isContractsChecked, setIsContractsChecked] = useState(false);
  const [isHdsCertifiedProject, setIsHdsCertifiedProject] = useState(false);

  const {
    data: isAlreadyHdsCertifiedProject,
  } = useIsAlreadyHdsCertifiedProject(project.project_id);

  const isContractsDisplayed = isHDSChecked && !isHdsCertifiedProject;

  useEffect(() => {
    setIsHdsCertifiedProject(isAlreadyHdsCertifiedProject || false);
    setIsHDSChecked(isAlreadyHdsCertifiedProject || false);
  }, [isAlreadyHdsCertifiedProject]);

  const { data: cartServiceHDSOption } = useGetHdsCartServiceOption(
    project?.project_id,
  );
  const isValidForCertification = !!cartServiceHDSOption;

  /**
   * Prepare a cart only if the the project is valid for HDS certification
   * And not already HDS certified
   */
  const { data: cart } = usePrepareHdsCart({
    projectId: project?.project_id as string,
    cartServiceHDSOption,
    enabled:
      !!project?.project_id &&
      isValidForCertification &&
      !isHdsCertifiedProject,
  });

  const { data: cartSummary } = useGetCartSummary(cart?.cartId);

  const handleHdsChecked = useCallback((isChecked: boolean) => {
    setIsHDSChecked(isChecked);
    setIsContractsChecked(false);
  }, []);

  const {
    mutate: checkoutCart,
    isPending: isCheckoutCartPending,
  } = useCheckoutWithFidelityAccount({
    onSuccess: () => {
      setIsHdsCertifiedProject(true);
      setIsContractsChecked(false);
      addSuccess(
        t('pci_projects_project_edit_hds_btn_validate_status_success', {
          projectName: project?.description,
        }),
      );
    },
    onError: (error: ApiError) => {
      addError(
        t('pci_projects_project_edit_hds_btn_validate_status_error', {
          error: error.message,
        }),
      );
    },
  });

  const handleSubmit = () => {
    if (cart) {
      checkoutCart({ cartId: cart.cartId });
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-3">
        {t('pci_projects_project_edit_hds_title')}
      </OdsText>

      <HdsOption
        isChecked={isHDSChecked}
        onCheckChanged={handleHdsChecked}
        isAlreadyCertifiedProject={isHdsCertifiedProject}
        isValidForCertification={isValidForCertification}
      />

      {isContractsDisplayed && (
        <Contracts
          contracts={cartSummary?.contracts}
          isChecked={isContractsChecked}
          onCheckChanged={setIsContractsChecked}
        />
      )}

      <OdsButton
        size="md"
        color="primary"
        label={t('pci_projects_project_edit_hds_btn_validate')}
        isDisabled={!isContractsChecked}
        isLoading={isCheckoutCartPending}
        onClick={handleSubmit}
        data-testid="hds-section_submit-button"
      />
      <OdsDivider spacing="48" />
    </section>
  );
}
