import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_LINK_ICON_ALIGNMENT } from '@ovhcloud/ods-components';
import { OdsCard, OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { vaultsQueries } from '@ovh-ux/backup-agent/data/queries/vaults.queries';
import { urls as BackupAgentUrls } from '@ovh-ux/backup-agent/routes/routes.constants';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';

import { Step1CompletedData } from '@/types/Tunnel.type';

import { Step1Selection } from './_components/Step1Selection.component';
import { Step2Polling } from './_components/Step2Polling.component';
import { TunnelStepsSidebar } from './_components/TunnelStepsSidebar.component';

const SESSION_KEY = 'bmc_tunnel_step1';

export default function TunnelPage() {
  const { t } = useTranslation('tunnel');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // R08: a user who already owns a READY vault must never re-enter the wizard
  // (which would create a duplicate order). Mirrors the onboarding-page guard.
  const { data: hasReadyVault, isPending: isVaultPending } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    retry: false,
    select: (vaults) =>
      vaults.filter(({ currentState: { status } }) => status === 'READY').length >= 1,
  });

  const [step1Data, setStep1Data] = useState<Step1CompletedData | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as Step1CompletedData) : null;
    } catch {
      return null;
    }
  });
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);

  // Nettoie le sessionStorage dès que le vault passe READY (la garde redirige).
  useEffect(() => {
    if (hasReadyVault) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [hasReadyVault]);

  const handleStep1Complete = (data: Step1CompletedData) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setStep1Data(data);
  };

  const handleBackToStep1 = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setStep1Data(null);
  };

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
    <RedirectionGuard
      condition={!!hasReadyVault}
      isLoading={isVaultPending}
      route={BackupAgentUrls.dashboardTenant}
    >
      <div className="w-full max-w-[80rem] mx-auto flex flex-col gap-6 p-6">
        <header className="flex flex-col gap-4">
          <OdsLink
            href=""
            icon={ODS_ICON_NAME.arrowLeft}
            iconAlignment={ODS_LINK_ICON_ALIGNMENT.left}
            label={t('tunnel:back_link')}
            isDisabled={isBackDisabled}
            title={isBackDisabled ? t('tunnel:back_disabled_tooltip') : undefined}
            onClick={() => !isBackDisabled && navigate(BackupAgentUrls.dashboardTenant)}
          />
          <OdsText preset="heading-1">{t('tunnel:page_title')}</OdsText>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <OdsCard className="p-6">
              <Step1Selection
                onCheckoutPendingChange={setIsCheckoutPending}
                onComplete={handleStep1Complete}
              />
            </OdsCard>

            <div ref={step2Ref} className="w-full">
              <OdsCard className="p-6 w-full">
                <Step2Polling serverData={step1Data} onBackToStep1={handleBackToStep1} />
              </OdsCard>
            </div>
          </div>

          <TunnelStepsSidebar currentStep={currentStep} />
        </div>
      </div>
    </RedirectionGuard>
  );
}
