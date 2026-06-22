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

import './Tunnel.css';
import { Step1Selection } from './_components/Step1Selection.component';
import { Step2Polling } from './_components/Step2Polling.component';
import { TunnelStepsSidebar } from './_components/TunnelStepsSidebar.component';

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

  // TODO: remove mock — bypasses checkout to preview Step 2
  const [step1Data, setStep1Data] = useState<Step1CompletedData | null>({
    serverName: 'ns123456.ip-1-2-3.eu',
    serverIp: '1.2.3.4',
    serverRegion: 'GRA',
    os: 'LINUX',
  });
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
    <RedirectionGuard
      condition={!!hasReadyVault}
      isLoading={isVaultPending}
      route={BackupAgentUrls.dashboardTenant}
    >
      <div className="ba-tunnel-layout flex flex-col gap-6 p-6">
        <header className="flex flex-col gap-4">
          <OdsLink
            icon={ODS_ICON_NAME.arrowLeft}
            iconAlignment={ODS_LINK_ICON_ALIGNMENT.left}
            label={t('tunnel:back_link')}
            isDisabled={isBackDisabled}
            title={isBackDisabled ? t('tunnel:back_disabled_tooltip') : undefined}
            onClick={() => !isBackDisabled && navigate(BackupAgentUrls.dashboardTenant)}
          />
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

            <div ref={step2Ref} className="w-full">
              <OdsCard className="p-6 w-full">
                <Step2Polling serverData={step1Data} onBackToStep1={() => setStep1Data(null)} />
              </OdsCard>
            </div>
          </div>

          <TunnelStepsSidebar currentStep={currentStep} />
        </div>
      </div>
    </RedirectionGuard>
  );
}
