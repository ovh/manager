import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import {
  OdsButton,
  OdsCheckbox,
  OdsLink,
  OdsMessage,
  OdsSkeleton,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import DiscoveryGuard from '@/pages/onboarding/DiscoveryGuard.component';

import {
  useContractAgreements,
  useCreateCart,
  useFinalizeCart,
} from '@/data/hooks/useCart';
import { CartSummary, PlanCode } from '@/data/types/cart.type';

import { INDIAN_KYC_SUPPORT_LINK } from '@/constants';
import { urls } from '@/routes/routes.constant';

import onboardingImage from '../../../public/assets/onboarding.png';
import onboardingUsImage from '../../../public/assets/onboarding-us.png';
import ItalyAgreements from '@/components/ItalyAgreements';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const user = context.environment.getUser();
  const isUsRegion = context.environment.getRegion() === 'US';
  const isItalySubsidiary = user.ovhSubsidiary === 'IT';
  const [hasContractsAgreements, setHasContractsAgreements] = useState(false);
  const [hasItalyAgreements, setHasItalyAgreements] = useState(false);
  const needKycValidation = !user.kycValidated && user.ovhSubsidiary === 'IN';
  const defaultProjectName = useMemo(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    return `Project ${currentDate}`;
  }, []);
  const { data: cart, isLoading: isCartLoading } = useCreateCart(
    user.ovhSubsidiary,
    PlanCode.PROJECT_DISCOVERY,
    defaultProjectName,
  );
  const {
    data: contracts,
    isLoading: isContractsLoading,
  } = useContractAgreements(cart?.cartId ?? null);

  const { finalizeCart, isPending: isFinalizationPending } = useFinalizeCart({
    onSuccess(summary: CartSummary) {
      const vouchercode =
        summary?.projectItem?.voucherConfiguration?.value || '';
      const creatingUrl = urls.creating
        .replace(':orderId', `${summary.orderId}`)
        .replace(':voucherCode', vouchercode);
      navigate(`../${creatingUrl}`);
    },
    onError() {},
  });

  const isContractAgreementDisabled =
    needKycValidation || isCartLoading || isContractsLoading;
  const isProjectCreationDisabled =
    isFinalizationPending ||
    !hasContractsAgreements ||
    (isItalySubsidiary ? !hasItalyAgreements : false);

  const handleDiscoveryProjectClick = () => {
    if (isProjectCreationDisabled || !cart || !cart.cartId) {
      return;
    }
    finalizeCart(cart.cartId);
  };

  const goToProjectCreation = () => {
    navigate(`../${urls.creation}`);
  };

  if (isUsRegion) {
    return (
      <DiscoveryGuard>
        <div
          className="pci_project_onboarding_us w-100 h-100 flex flex-row max-w-[100vw] overflow-x-hidden"
          data-testid="discovery-page-us"
        >
          <img
            className="onboarding-us-img invisible md:visible"
            src={onboardingUsImage}
            alt=""
          />

          <div className="flex flex-col gap-[1em] w-[100%] md:w-[50%] p-[1em] box-border">
            {/* Public cloud description */}
            <OdsText preset="heading-1">
              {t('pci_projects_onboarding_us_title')}
            </OdsText>
            <OdsText preset="paragraph">
              {t('pci_projects_onboarding_us_description1')}
            </OdsText>
            <OdsText preset="paragraph">
              {t('pci_projects_onboarding_us_description2')}
            </OdsText>
            <OdsText preset="paragraph">
              {t('pci_projects_onboarding_us_description3')}
            </OdsText>

            {/* CTA: Create a project */}
            <OdsButton
              data-testid="project-creation-redirection-cta"
              label={t('pci_projects_onboarding_create_project')}
              onClick={goToProjectCreation}
            />
          </div>
        </div>
      </DiscoveryGuard>
    );
  }

  return (
    <DiscoveryGuard>
      <div
        className="pci_projects_onboarding w-100 h-100 overflow-auto"
        data-testid="discovery-page"
      >
        <div className="flex flex-col gap-[1em] w-100 md:w-[50%] md:ml-[25%] px-[1em] text-center">
          {/* KYC verification message (Indian accounts) */}
          {needKycValidation && (
            <OdsMessage
              className="w-[100%]"
              color="information"
              isDismissible={false}
            >
              <div data-testid="kyc-message">
                <OdsText preset="span" className="inline">
                  {t(
                    'pci_projects_onboarding_banner_kyc_validation_under_verification_description',
                  )}
                </OdsText>
                <OdsLink
                  className="inline"
                  label={t(
                    'pci_projects_onboarding_banner_kyc_validation_under_verification_link',
                  )}
                  href={INDIAN_KYC_SUPPORT_LINK}
                  rel="noopener"
                  target="_blank"
                />
              </div>
            </OdsMessage>
          )}

          <img className="w-100" src={onboardingImage} alt="" />

          {/* Public cloud description */}
          <OdsText preset="heading-1">
            {t('pci_projects_onboarding_title')}
          </OdsText>
          <OdsText preset="paragraph">
            {t('pci_projects_onboarding_description1')}
          </OdsText>
          <OdsText preset="paragraph">
            {t('pci_projects_onboarding_description2')}
          </OdsText>

          {/* Contracts Agreement */}
          <div
            className="contracts-agreements-block"
            data-testid="contracts-agreements"
          >
            <div className="flex items-center justify-start gap-4 mb-2">
              <OdsCheckbox
                name={'project-contracts-agreements'}
                inputId={'project-contracts-agreements'}
                isChecked={hasContractsAgreements}
                onOdsChange={(e) => setHasContractsAgreements(e.detail.checked)}
                isDisabled={isContractAgreementDisabled}
              />
              <label htmlFor="project-contracts-agreements">
                <OdsText
                  preset="paragraph"
                  className={clsx({
                    'font-bold': hasContractsAgreements,
                    disabled: isContractAgreementDisabled,
                  })}
                >
                  {t('pci_projects_onboarding_contracts_agreements_label')}
                </OdsText>
              </label>
            </div>
            <div className="contracts-agreements flex flex-row justify-center flex-wrap m-w-100 text-sm">
              {!(isCartLoading || isContractsLoading) &&
                contracts &&
                contracts.map((contract) => (
                  <OdsLink
                    key={contract.name}
                    className="contract-link"
                    label={contract.name}
                    href={contract.url}
                    rel="noopener"
                    target="_blank"
                    icon="external-link"
                  />
                ))}
              {(isCartLoading || isContractsLoading) && (
                <OdsSkeleton className="w-full mt-4 mb-4" />
              )}
            </div>
          </div>

          {/* Italy-specific agreements */}
          {isItalySubsidiary && (
            <ItalyAgreements
              hasAgreements={hasItalyAgreements}
              onSetHasAgreements={setHasItalyAgreements}
            />
          )}

          {/* CTA: Create a project */}
          <OdsButton
            data-testid="create-discovery-cta"
            label={t('pci_projects_onboarding_create_project')}
            isDisabled={isProjectCreationDisabled}
            onClick={handleDiscoveryProjectClick}
          />
          {isFinalizationPending && (
            <div className="min-h-[4em]">
              <OdsSpinner />
            </div>
          )}
        </div>
      </div>
    </DiscoveryGuard>
  );
}
