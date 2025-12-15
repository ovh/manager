import { useCallback, useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { Translation, useTranslation } from 'react-i18next';

import { OdsButton, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Contracts from '@/components/contracts/Contracts';
import HdsOption from '@/components/hds-option/HdsOption';
import { useGetCartSummary } from '@/data/hooks/useCart';
import { useCheckoutWithFidelityAccount } from '@/hooks/use-checkout/useCheckout';
import { useTrackingAdditionalData } from '@/hooks/useTracking';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { TProject } from '@/types/pci-common.types';

import {
  useGetHdsCartServiceOption,
  useIsAlreadyHdsCertifiedProject,
  usePrepareHdsCart,
} from './useHds';

type ApiError = AxiosError<{ message: string }>;

export default function HdsSection({ project }: { project: TProject }) {
  const { t } = useTranslation('hds');

  const { addSuccess, addError } = useNotifications();

  const { trackClick, trackPage } = useOvhTracking();
  const trackingAdditionalData = useTrackingAdditionalData();

  const [isHDSChecked, setIsHDSChecked] = useState(false);
  const [isContractsChecked, setIsContractsChecked] = useState(false);
  const [isHdsCertifiedProject, setIsHdsCertifiedProject] = useState(false);

  const { data: isAlreadyHdsCertifiedProject } = useIsAlreadyHdsCertifiedProject(
    project.project_id,
  );

  const isContractsDisplayed = isHDSChecked && !isHdsCertifiedProject;

  useEffect(() => {
    setTimeout(() => {
      setIsHdsCertifiedProject(isAlreadyHdsCertifiedProject || false);
      if (isAlreadyHdsCertifiedProject) {
        setIsHDSChecked(true);
      }
    }, 0);
  }, [isAlreadyHdsCertifiedProject]);

  const { data: cartServiceHDSOption } = useGetHdsCartServiceOption(project?.project_id);
  const isValidForCertification = !!cartServiceHDSOption;

  /**
   * Prepare a cart only if the the project is valid for HDS certification
   * And not already HDS certified
   */
  const { data: cart } = usePrepareHdsCart({
    projectId: project?.project_id,
    cartServiceHDSOption,
    enabled: !!project?.project_id && isValidForCertification && !isHdsCertifiedProject,
  });

  const { data: cartSummary, isLoading: isCartSummaryLoading } = useGetCartSummary(cart?.cartId);

  const handleHdsChecked = useCallback(
    (isChecked: boolean) => {
      trackClick({
        actionType: 'action',
        actions: PROJECTS_TRACKING.SETTINGS.HDS_SECTION.CTA_UPDATE_HDS,
      });

      setIsHDSChecked(isChecked);
      setIsContractsChecked(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { mutate: checkoutCart, isPending: isCheckoutCartPending } = useCheckoutWithFidelityAccount(
    {
      onSuccess: () => {
        setIsHdsCertifiedProject(true);
        setIsContractsChecked(false);

        trackPage({
          pageType: PageType.bannerInfo,
          pageName: PROJECTS_TRACKING.SETTINGS.HDS_SECTION.REQUEST_SUCCESS,
          additionalData: trackingAdditionalData,
        });

        addSuccess(
          <Translation ns="hds">
            {(_t) =>
              _t('pci_projects_project_edit_hds_btn_validate_status_success', {
                projectName: project?.description,
              })
            }
          </Translation>,
        );
      },
      onError: (error: ApiError) => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PROJECTS_TRACKING.SETTINGS.HDS_SECTION.REQUEST_ERROR,
          additionalData: {
            ...trackingAdditionalData,
            pciCreationErrorMessage: error.message,
          },
        });

        addError(
          <Translation ns="hds">
            {(_t) =>
              _t('pci_projects_project_edit_hds_btn_validate_status_error', {
                message: error.message,
              })
            }
          </Translation>,
        );
      },
    },
  );

  const handleSubmit = () => {
    if (cart) {
      checkoutCart({ cartId: cart.cartId });
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <OdsText preset="heading-2">{t('pci_projects_project_edit_hds_title')}</OdsText>

      <HdsOption
        isChecked={isHDSChecked}
        onCheckChanged={handleHdsChecked}
        isAlreadyCertifiedProject={isHdsCertifiedProject}
        isValidForCertification={isValidForCertification}
      />

      {isContractsDisplayed && (
        <Contracts
          contracts={cartSummary?.contracts}
          isLoading={isCartSummaryLoading}
          isChecked={isContractsChecked}
          onCheckChanged={setIsContractsChecked}
        />
      )}

      <OdsButton
        size="md"
        className="w-fit"
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
