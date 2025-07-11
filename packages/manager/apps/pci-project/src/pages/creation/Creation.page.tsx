import { StepComponent, Title } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigStep from './steps/ConfigStep';
import PaymentStep from './steps/PaymentStep';

export default function ProjectCreation() {
  const { t } = useTranslation([
    'new/config',
    'new/payment',
    NAMESPACES.ACTIONS,
  ]);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Config
  const isConfigChecked = currentStep > 0;
  const isConfigLocked = currentStep > 0;

  // Step 2: Payment
  const isPaymentOpen = currentStep === 1;
  const isPaymentChecked = false;
  const isPaymentLocked = currentStep < 1;

  return (
    <div className="h-screen flex items-center justify-center bg-[var(--ods-color-primary-050)] md:px-[20%] px-[10%]">
      <div className="bg-white p-10 w-full">
        <Title>{t('pci_project_new_config_title')}</Title>

        <StepComponent
          order={1}
          isOpen={true}
          isLocked={isConfigLocked}
          isChecked={isConfigChecked}
          title={t('pci_project_new_config_description_label')}
          edit={
            currentStep > 0
              ? {
                  action: () => setCurrentStep(0),
                  label: t('modify', { ns: NAMESPACES.ACTIONS }),

                  isDisabled: false,
                }
              : undefined
          }
          next={{
            action: () => setCurrentStep(1),
            label: t('next', { ns: NAMESPACES.ACTIONS }),
            isDisabled: false,
          }}
          skip={{
            action: () => navigate('..'),
            label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          }}
        >
          <ConfigStep />
        </StepComponent>

        <StepComponent
          order={2}
          isOpen={isPaymentOpen}
          isLocked={isPaymentLocked}
          isChecked={isPaymentChecked}
          title={t('pci_project_new_payment_description_label', {
            ns: 'new/payment',
          })}
          next={{
            action: () => {
              /**
               * TODO: handle project creation
               */
            },
            label: t('pci_project_new_payment_btn_continue_default', {
              ns: 'new/payment',
            }),
            isDisabled: false,
          }}
          skip={{
            action: () => navigate('..'),
            label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          }}
        >
          <PaymentStep />
        </StepComponent>
      </div>
    </div>
  );
}
