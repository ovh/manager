import { useProject } from '@ovh-ux/manager-pci-common';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsCard,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import { useHref, useNavigate } from 'react-router-dom';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Notifications,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_CARD_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useContext, useEffect, useState } from 'react';
import activateImage from '@/assets/activate-bg.png';
import FullPageSpinner from '@/components/FullPageSpinner';
import { DISCOVERY_PROMOTION_VOUCHER } from '@/constants';
import { useCheckVoucherEligibility } from '@/data/hooks/payment/useEligibility';
import {
  useCreateAndAssignCart,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import { useServiceIds } from '@/data/hooks/useServices';
import { CartConfiguration } from '@/data/types/cart.type';
import { TEligibilityVoucher } from '@/data/types/payment/eligibility.type';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import CreditConfirmation from '@/pages/creation/components/credit/CreditConfirmation.component';
import WillPaymentComponent from '@/pages/creation/components/payment/WillPayment.component';
import Voucher from '@/pages/creation/components/voucher/Voucher';
import { useWillPayment } from '@/pages/creation/hooks/useWillPayment';
import { useWillPaymentConfig } from '@/pages/creation/hooks/useWillPaymentConfig';
import { useProjectActivation } from './hooks/useActivateProject';

export default function ActivatePage() {
  const { t } = useTranslation(['activate', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const projectId = useProjectIdFromParams();

  const { data: serviceIds } = useServiceIds(projectId);
  const serviceId = serviceIds?.[0];

  const [promotionVoucher, setPromotionVoucher] = useState<
    TEligibilityVoucher['credit'] | null
  >(null);

  const [voucherConfiguration, setVoucherConfiguration] = useState<
    CartConfiguration | undefined
  >(undefined);

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();
  const ovhSubsidiary = user.ovhSubsidiary as OvhSubsidiary;

  const { data: project } = useProject();
  const hrefProject = useHref('..');

  const { mutate: orderProjectItem, data: projectItem } = useOrderProjectItem();
  const { mutate: createAndAssignCart, data: cart } = useCreateAndAssignCart({
    onSuccess: (createdCart) => {
      orderProjectItem({
        cartId: createdCart.cartId,
      });
    },
  });

  const {
    mutate: checkEligibility,
    isPending: isCheckingEligibility,
  } = useCheckVoucherEligibility({
    onSuccess: (data?: TEligibilityVoucher) => {
      if (data?.credit) {
        setPromotionVoucher(data.credit);
      }
    },
  });

  const handleVoucherConfigurationChange = (
    voucherConfig: CartConfiguration | undefined,
  ) => {
    setVoucherConfiguration(voucherConfig);
  };

  const {
    handleActivateProject,
    handleCreditPayment,
    isSubmitting,
    creditPaymentAmount,
  } = useProjectActivation({
    promotionVoucher,
    serviceId,
  });

  const {
    isCreditPayment,
    needsSave,
    isSaved,
    canSubmit,
    hasDefaultPaymentMethod,
    savePaymentMethod,
    handlePaymentStatusChange,
    handleRegisteredPaymentMethodSelected,
  } = useWillPayment();

  const willPaymentConfig = useWillPaymentConfig({
    onPaymentStatusChange: handlePaymentStatusChange,
  });

  const handleSubmit = () => {
    if (needsSave && !isCreditPayment) {
      savePaymentMethod();
    } else if (hasDefaultPaymentMethod || isCreditPayment) {
      handleActivateProject();
    } else if (isCreditPayment && creditPaymentAmount) {
      handleCreditPayment();
    }
  };

  /**
   * Auto-proceed with project creation when payment method is saved
   */
  useEffect(() => {
    if (isSaved) {
      handleActivateProject();
    }
  }, [isSaved]);

  useEffect(() => {
    createAndAssignCart({ ovhSubsidiary });
    checkEligibility(DISCOVERY_PROMOTION_VOUCHER);
  }, [ovhSubsidiary]);

  if (!cart || !projectItem || isCheckingEligibility || !serviceId) {
    return <FullPageSpinner />;
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
      <div className="mb-6">
        <Notifications />
      </div>

      <div className="flex flex-col-reverse md:flex-row">
        {/* Form section */}
        <section className="flex flex-col gap-6 mt-6 md:mt-0 md:w-1/2 md:pr-12">
          <OdsText preset="heading-3">
            {t('pci_projects_project_activate_title')}
          </OdsText>

          <OdsText>{t('pci_projects_project_activate_description_1')}</OdsText>

          <OdsText>{t('pci_projects_project_activate_description_2')}</OdsText>

          <Voucher
            cartId={cart.cartId}
            itemId={projectItem.itemId}
            voucherConfiguration={voucherConfiguration}
            setVoucherConfiguration={handleVoucherConfigurationChange}
          />

          <WillPaymentComponent
            config={willPaymentConfig}
            onRegisteredPaymentMethodSelected={
              handleRegisteredPaymentMethodSelected
            }
          />

          {creditPaymentAmount && (
            <OdsCard color={ODS_CARD_COLOR.primary} className="my-6 p-6">
              <CreditConfirmation creditAmount={creditPaymentAmount} />
            </OdsCard>
          )}

          <div className="flex justify-start gap-4">
            <OdsButton
              size="sm"
              variant="outline"
              label={t('cancel', { ns: NAMESPACES.ACTIONS })}
              onClick={() => navigate('..')}
            />
            <OdsButton
              color="primary"
              size="sm"
              label={t('pci_projects_project_activate_cta')}
              icon={ODS_ICON_NAME.arrowRight}
              iconAlignment="right"
              isDisabled={!canSubmit}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            />
          </div>
        </section>

        {/* Promotional banner */}
        <section className="flex flex-col gap-6 p-4 md:w-1/2 bg-[var(--ods-color-primary-050)]">
          <div className="flex flex-col gap-6">
            {!promotionVoucher ? (
              <div>
                <OdsText preset="heading-1">
                  {t('pci_projects_project_activate_banner_no_promotion_title')}
                </OdsText>
                <OdsText>
                  {t(
                    'pci_projects_project_activate_banner_no_promotion_description',
                  )}
                </OdsText>
              </div>
            ) : (
              <div>
                <Trans t={t}>
                  <OdsText preset="heading-1">
                    {t('pci_projects_project_activate_banner_promotion_title', {
                      amount: promotionVoucher.text,
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
          </div>

          <div className="hidden md:flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <OdsText preset="heading-4">
                {t('pci_projects_project_activate_banner_section_1_title')}
              </OdsText>
              <OdsText>
                {t(
                  'pci_projects_project_activate_banner_section_1_description',
                )}
              </OdsText>
            </div>

            <div className="flex flex-col gap-6">
              <OdsText preset="heading-4">
                {t('pci_projects_project_activate_banner_section_2_title')}
              </OdsText>
              <OdsText>
                {t(
                  'pci_projects_project_activate_banner_section_2_description',
                )}
              </OdsText>
            </div>

            <img
              src={activateImage}
              alt={t('pci_projects_project_activate_banner_img_alt')}
              aria-hidden="true"
              className="w-full"
            />
          </div>
        </section>
      </div>
    </BaseLayout>
  );
}
