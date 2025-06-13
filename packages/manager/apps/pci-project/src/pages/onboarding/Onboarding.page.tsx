import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  OdsButton,
  OdsCheckbox,
  OdsLink,
  OdsText,
  OdsAccordion,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  PciTrustedZoneBanner,
  useTrustedZoneBanner,
} from '@ovh-ux/manager-pci-common';

import { ITALY_AGREEMENT_TEXT } from '@/constants';

import onboardingImage from '@/assets/onboarding.png';
import onboardingUsImage from '@/assets/onboarding-us.png';

interface ContractLink {
  name: string;
  url: string;
}

const MOCK_CONTRACTS: ContractLink[] = [
  {
    name: 'EULA_Microsoft',
    url: 'https://www.ovhcloud.com/fr/',
  },
  {
    name: 'Data_Protection_Agreement',
    url: 'https://www.ovhcloud.com/fr/',
  },
  {
    name: 'Conditions Generales de Services',
    url: 'https://www.ovhcloud.com/fr/',
  },
  {
    name: 'Conditions Particulieres des Services Public Cloud',
    url: 'https://www.ovhcloud.com/fr/',
  },
];

const IS_US_REGION = false;
const IS_IT_REGION = true;
const IS_TRUSTED_ZONE = false;
const HAS_KYC_VERIFICATION_PENDING = true;

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const [hasContractsAgreements, setHasContractsAgreements] = useState(false);
  const [hasItalyAgreements, setHasItalyAgreements] = useState(false);
  const isUsRegion = IS_US_REGION;
  const isItRegion = IS_IT_REGION;
  const isTrustedZone = IS_TRUSTED_ZONE;
  const hasKycValidationPending = HAS_KYC_VERIFICATION_PENDING;
  const contractAgreementLinks = MOCK_CONTRACTS;
  const {
    isBannerVisible, // TODO: set 'isTrustedZone' instead
    isLoading: isTrustedZoneLoading,
  } = useTrustedZoneBanner();
  const isLoading = isTrustedZoneLoading;

  const isContractAgreementDisabled = hasKycValidationPending;
  const isProjectCreationDisabled =
    isLoading ||
    !hasContractsAgreements ||
    (isItRegion ? !hasItalyAgreements : false);

  if (isUsRegion) {
    return (
      <div className="pci_project_onboarding_us w-100 h-100 flex flex-row max-w-[100vw] overflow-x-hidden">
        <PciTrustedZoneBanner />
        <img
          className="onboarding-us-img invisible md:visible"
          src={onboardingUsImage}
          alt=""
        />

        <div className="flex flex-col gap-[1em] w-[100%] md:w-[50%] p-[1em] box-border">
          {/* TODO: account migration notification ? */}

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
          {!isTrustedZone && (
            <OdsButton label={t('pci_projects_onboarding_create_project')} />
          )}

          {/* CTA: Call customer (for trusted zone) */}
          {isTrustedZone && (
            <>
              <OdsText preset="paragraph" className={'font-bold'}>
                {t('pci_projects_onboarding_us_banner_trusted_customer_info_1')}
              </OdsText>
              <OdsText preset="paragraph" className={'font-bold'}>
                {t('pci_projects_onboarding_us_banner_trusted_customer_info_2')}
              </OdsText>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pci_projects_onboarding w-100 h-100 overflow-auto">
      <div className="flex flex-col gap-[1em] w-100 md:w-[50%] md:ml-[25%] px-[1em] text-center">
        {/* KYC verification message (Indian accounts) */}
        {hasKycValidationPending && (
          <OdsMessage
            className="w-[100%]"
            color="information"
            isDismissible={false}
          >
            <div>
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
                href={''}
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
        <div className="contracts-agreements-block">
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
            {contractAgreementLinks.map((contract) => (
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
          </div>
        </div>

        {/* Italy-specific agreements */}
        {isItRegion && (
          <div className="italy-agreements text-left">
            <div className="flex items-center justify-start gap-4 mb-2">
              <OdsCheckbox
                name={'project-italy-agreements'}
                inputId={'project-italy-agreements'}
                isChecked={hasItalyAgreements}
                onOdsChange={(e) => setHasItalyAgreements(e.detail.checked)}
              />
              <label htmlFor="project-italy-agreements">
                <OdsText
                  preset="paragraph"
                  className={clsx(hasItalyAgreements && 'font-bold')}
                >
                  {ITALY_AGREEMENT_TEXT.TITLE}
                </OdsText>
              </label>
            </div>
            <OdsAccordion>
              <OdsText preset="span" className="font-bold" slot="summary">
                {ITALY_AGREEMENT_TEXT.LINK}
              </OdsText>
              <OdsText preset="paragraph">
                {ITALY_AGREEMENT_TEXT.DETAILS}
              </OdsText>
            </OdsAccordion>
          </div>
        )}

        {/* CTA: Create a project */}
        {!isTrustedZone && (
          <OdsButton
            label={t('pci_projects_onboarding_create_project')}
            isDisabled={isProjectCreationDisabled}
          />
        )}

        {/* CTA: Call customer (for trusted zone) */}
        {isTrustedZone && (
          <>
            <OdsText preset="paragraph" className={'font-bold'}>
              {t('pci_projects_onboarding_banner_trusted_customer_info_1')}
            </OdsText>
            <OdsText preset="paragraph" className={'font-bold'}>
              {t('pci_projects_onboarding_banner_trusted_customer_info_2')}
            </OdsText>
          </>
        )}
      </div>
    </div>
  );
}
