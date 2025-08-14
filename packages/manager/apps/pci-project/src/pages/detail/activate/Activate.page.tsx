import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsDivider,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  BaseLayout,
  Notifications,
  OvhSubsidiary,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext, useEffect, useState } from 'react';
import activateImage from '@/assets/activate-bg.png';
import PaymentMethods from '@/components/payment/PaymentMethods';
import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';
import { useCheckVoucherEligibility } from '@/data/hooks/payment/useEligibility';
import {
  useCreateAndAssignCart,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import {
  useActivateProject,
  useClaimVoucher,
  useSimulateProjectActivation,
} from '@/data/hooks/useProjectActivation';
import { CartConfiguration } from '@/data/types/cart.type';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import Voucher from '@/pages/creation/components/voucher/Voucher';
import { useServiceIds } from '@/data/hooks/useServices';

export default function ActivatePage() {
  const { t } = useTranslation(['activate', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const projectId = useProjectIdFromParams();

  const { addError } = useNotifications();

  const { data: serviceIds } = useServiceIds(projectId);
  const serviceId = serviceIds?.[0];

  const [
    discoveryPromotionVoucherAmount,
    setDiscoveryPromotionVoucherAmount,
  ] = useState('');

  const [voucherConfiguration, setVoucherConfiguration] = useState<
    CartConfiguration | undefined
  >(undefined);

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();
  const ovhSubsidiary = user.ovhSubsidiary as OvhSubsidiary;

  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const isDiscovery = isDiscoveryProject(project);

  const handleVoucherConfigurationChange = (
    voucherConfig: CartConfiguration | undefined,
  ) => {
    setVoucherConfiguration(voucherConfig);
  };

  const { mutate: createAndAssignCart, data: cart } = useCreateAndAssignCart();
  const { mutate: orderProjectItem, data: projectItem } = useOrderProjectItem();

  const {
    mutate: checkEligibility,
    isPending: isCheckingEligibility,
  } = useCheckVoucherEligibility({
    onSuccess: (data) => {
      setDiscoveryPromotionVoucherAmount(data?.credit?.text || '');
    },
  });

  const { mutate: activateProject } = useActivateProject({
    onSuccess: (response) => {
      // Navigate to project updating page
      navigate(
        `/updating?orderId=${response.order.orderId}&voucherCode=${DISCOVERY_PROMOTION_VOUCHER}`,
      );
    },
    onError: (error: ApiError) => {
      addError(
        t('pci_projects_project_activate_message_fail', {
          message: error?.response?.data?.message || error.message,
        }),
      );
    },
  });

  const { mutate: simulateActivation } = useSimulateProjectActivation({
    onSuccess: (result) => {
      if (result.order.prices.withTax.value !== 0) {
        // navigate somewhere
      } else if (serviceId) {
        activateProject(serviceId);
      }
    },
    onError: (error: ApiError) => {
      addError(
        t('pci_projects_project_activate_message_fail', {
          message: error?.response?.data?.message || error.message,
        }),
      );
    },
  });

  const { mutate: claimVoucher } = useClaimVoucher();

  const handleActivateProject = () => {
    // Step 1: Claim voucher if we have a promotion amount
    if (discoveryPromotionVoucherAmount) {
      claimVoucher({
        projectId,
        voucherCode: DISCOVERY_PROMOTION_VOUCHER,
      });
    }

    // Step 2: Simulate activation to check if payment is required
    if (serviceId) {
      simulateActivation(serviceId);
    }
  };

  useEffect(() => {
    createAndAssignCart(
      { ovhSubsidiary },
      {
        onSuccess: (createdCart) => {
          orderProjectItem({
            cartId: createdCart.cartId,
          });
        },
      },
    );

    if (isDiscovery) {
      checkEligibility(DISCOVERY_PROMOTION_VOUCHER);
    }
  }, [createAndAssignCart, orderProjectItem, ovhSubsidiary, isDiscovery]);

  if (!cart || !projectItem || isCheckingEligibility || !serviceId) {
    return <OdsSpinner />;
  }

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            href=""
            label={t('pci_projects_project_activate_title')}
          />
        </OdsBreadcrumb>
      }
      header={{}}
    >
      <div className="flex flex-col md:flex-row-reverse">
        <section className="flex flex-col gap-6 md:w-1/2 p-8  bg-[var(--ods-color-information-050)]">
          {!discoveryPromotionVoucherAmount ? (
            <div className="flex flex-col gap-6">
              <OdsText preset="heading-1">
                {t('pci_projects_project_activate_banner_no_promotion_title')}
              </OdsText>
              <OdsText preset="paragraph">
                {t(
                  'pci_projects_project_activate_banner_no_promotion_description',
                )}
              </OdsText>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Trans t={t}>
                <OdsText preset="heading-1">
                  {t('pci_projects_project_activate_banner_promotion_title', {
                    amount: discoveryPromotionVoucherAmount,
                  })}
                </OdsText>
              </Trans>
              <OdsText>
                {t(
                  'pci_projects_project_activate_banner_promotion_description_1',
                )}
              </OdsText>
              <OdsText>
                {t(
                  'pci_projects_project_activate_banner_promotion_description_2',
                )}
              </OdsText>
            </div>
          )}

          <div className="flex flex-col gap-6 my-4">
            <OdsText preset="heading-4">
              {t('pci_projects_project_activate_banner_section_1_title')}
            </OdsText>
            <OdsText>
              {t('pci_projects_project_activate_banner_section_1_description')}
            </OdsText>
            <OdsText preset="heading-4">
              {t('pci_projects_project_activate_banner_section_2_title')}
            </OdsText>
            <OdsText>
              {t('pci_projects_project_activate_banner_section_2_description')}
            </OdsText>
            <img
              src={activateImage}
              alt={t('pci_projects_project_activate_banner_img_alt')}
              aria-hidden="true"
              className="w-full"
            />
          </div>
        </section>

        <section className="flex flex-col gap-6 md:w-1/2 md:pr-8">
          <Notifications />
          <OdsText preset="heading-3">
            {t('pci_projects_project_activate_title')}
          </OdsText>
          <OdsText preset="paragraph">
            {t('pci_projects_project_activate_description_1')}
          </OdsText>
          <OdsText preset="paragraph">
            {t('pci_projects_project_activate_description_2')}
          </OdsText>

          <OdsDivider spacing="16" />

          <Voucher
            cartId={cart.cartId}
            itemId={projectItem.itemId}
            voucherConfiguration={voucherConfiguration}
            setVoucherConfiguration={handleVoucherConfigurationChange}
          />

          <OdsDivider spacing="16" />

          <PaymentMethods
            handlePaymentMethodChange={() => {}}
            handleSetAsDefaultChange={() => {}}
            paymentMethodHandler={() => {}}
            handleValidityChange={() => {}}
            handlePaymentMethodChallenge={true}
          />

          <div className="flex justify-end gap-4">
            <OdsButton
              size="sm"
              variant="outline"
              label={t('cancel', { ns: NAMESPACES.ACTIONS })}
              onClick={() => navigate(-1)}
            />
            <OdsButton
              color="primary"
              size="sm"
              label={t('pci_projects_project_activate_cta')}
              icon={ODS_ICON_NAME.home}
              onClick={handleActivateProject}
            />
          </div>
        </section>
      </div>
    </BaseLayout>
  );
}
