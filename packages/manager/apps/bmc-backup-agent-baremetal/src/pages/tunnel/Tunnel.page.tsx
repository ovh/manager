import { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { urls as BackupAgentUrls } from '@ovh-ux/backup-agent/routes/routes.constants';

import { Step1CompletedData } from '@/types/Tunnel.type';

import './Tunnel.css';
import { Step1Selection } from './_components/Step1Selection.component';
import { Step2Polling } from './_components/Step2Polling.component';
import { TunnelStepsSidebar } from './_components/TunnelStepsSidebar.component';

export default function TunnelPage() {
  const { t } = useTranslation('tunnel');

  const [step1Data, setStep1Data] = useState<Step1CompletedData | null>(null);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);

  const step2Ref = useRef<HTMLDivElement>(null);

  const currentStep: 1 | 2 = step1Data ? 2 : 1;
  const isBackDisabled = isCheckoutPending || step1Data !== null;

  // Auto-scroll to the freshly unlocked Step 2 once Step 1 completes.
  useEffect(() => {
    if (step1Data) {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step1Data]);

  return (
    <div className="ba-tunnel-layout flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-4">
        {isBackDisabled ? (
          <span
            className="inline-flex items-center gap-2 opacity-50"
            aria-disabled="true"
            title={t('tunnel:back_disabled_tooltip')}
          >
            <OdsIcon name={ODS_ICON_NAME.arrowLeft} />
            <OdsText preset="span">{t('tunnel:back_link')}</OdsText>
          </span>
        ) : (
          <Link to={BackupAgentUrls.dashboardTenant} className="inline-flex items-center gap-2">
            <OdsIcon name={ODS_ICON_NAME.arrowLeft} />
            <OdsText preset="span">{t('tunnel:back_link')}</OdsText>
          </Link>
        )}
        <OdsText preset="heading-1">{t('tunnel:page_title')}</OdsText>
      </header>

      <div className="ba-tunnel-content">
        <div className="flex flex-col gap-6">
          <OdsCard className="p-6">
            <Step1Selection
              onCheckoutPendingChange={setIsCheckoutPending}
              onComplete={setStep1Data}
            />
          </OdsCard>

          <div ref={step2Ref}>
            <OdsCard className="p-6">
              <Step2Polling serverData={step1Data} onBackToStep1={() => setStep1Data(null)} />
            </OdsCard>
          </div>
        </div>

        <TunnelStepsSidebar currentStep={currentStep} />
      </div>
    </div>
  );
}
