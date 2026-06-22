import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton, OdsIcon, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { queryKeys } from '@ovh-ux/backup-agent/data/queries/queryKeys';
import { urls as BackupAgentUrls } from '@ovh-ux/backup-agent/routes/routes.constants';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

import {
  useTunnelTenantPolling,
  useTunnelVspcPolling,
  useTunnelVspcStatusPolling,
} from '@/data/hooks/tunnel/useTunnelPolling.hook';
import { Step1CompletedData, TunnelPollingPhase } from '@/types/Tunnel.type';
import { POLLING_TIMEOUT_MS, TUNNEL_LINKS } from '@/utils/tunnel.constants';

import { AgentInstallationPanel } from './AgentInstallationPanel.component';

export type Step2PollingProps = {
  serverData: Step1CompletedData | null;
  onBackToStep1: () => void;
};

const isPollingPhase = (phase: TunnelPollingPhase) =>
  phase === 'init' ||
  phase === 'polling-tenant' ||
  phase === 'polling-vspc' ||
  phase === 'polling-status';

export const Step2Polling = ({ serverData, onBackToStep1 }: Step2PollingProps) => {
  const { t } = useTranslation('tunnel');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TODO: remove mock — forces ready state to preview post-loading UI
  const [phase, setPhase] = useState<TunnelPollingPhase>('ready');
  const [tenantId, setTenantId] = useState('mock-tenant-id');
  const [vspcId, setVspcId] = useState('mock-vspc-id');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continueButtonRef = useRef<HTMLOdsButtonElement>(null);
  const phaseRef = useRef<TunnelPollingPhase>(phase);
  phaseRef.current = phase;

  const isLocked = serverData === null;
  const isAgentPanelVisible = phase === 'polling-status' || phase === 'ready';

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      // Terminal states must not be overwritten by a late timeout.
      if (phaseRef.current !== 'ready' && phaseRef.current !== 'error-creation') {
        setPhase('timeout');
      }
    }, POLLING_TIMEOUT_MS);
  }, [clearTimer]);

  // Unlock: start the chain + the 30-minute timer when serverData arrives.
  useEffect(() => {
    if (isLocked) return undefined;
    setPhase((current) => (current === 'init' ? 'polling-tenant' : current));
    startTimer();
    return () => clearTimer();
  }, [isLocked, startTimer, clearTimer]);

  // TODO: remove mock — queries disabled to preview loading state
  const tenantQuery = useTunnelTenantPolling(false);
  const vspcQuery = useTunnelVspcPolling(tenantId, false);
  const statusQuery = useTunnelVspcStatusPolling(tenantId, vspcId, false);

  // Phase 1 → 2: first tenant found.
  useEffect(() => {
    if (phase !== 'polling-tenant') return;
    const found = tenantQuery.data?.[0]?.id;
    if (found) {
      setTenantId(found);
      setPhase('polling-vspc');
    }
  }, [phase, tenantQuery.data]);

  // Phase 2 → 3: first VSPC found.
  useEffect(() => {
    if (phase !== 'polling-vspc') return;
    const found = vspcQuery.data?.[0]?.id;
    if (found) {
      setVspcId(found);
      setPhase('polling-status');
    }
  }, [phase, vspcQuery.data]);

  // Phase 3 → terminal: READY or ERROR.
  useEffect(() => {
    if (phase !== 'polling-status') return;
    const status = statusQuery.data?.resourceStatus;
    if (status === 'READY') {
      setPhase('ready');
    } else if (status === 'ERROR') {
      setPhase('error-creation');
    }
  }, [phase, statusQuery.data]);

  // Any polling error → error-network.
  useEffect(() => {
    if (!isPollingPhase(phase)) return;
    if (tenantQuery.isError || vspcQuery.isError || statusQuery.isError) {
      setPhase('error-network');
    }
  }, [phase, tenantQuery.isError, vspcQuery.isError, statusQuery.isError]);

  // Stop the timer once a terminal state is reached.
  useEffect(() => {
    if (phase === 'ready' || phase === 'error-creation' || phase === 'timeout') {
      clearTimer();
    }
  }, [phase, clearTimer]);

  // Auto-focus the Continue button when the service is ready.
  useEffect(() => {
    if (phase === 'ready') {
      continueButtonRef.current?.focus();
    }
  }, [phase]);

  const handleRetry = () => {
    setTenantId('');
    setVspcId('');
    setPhase('polling-tenant');
    startTimer();
  };

  const handleBackToStep1 = () => {
    clearTimer();
    setPhase('init');
    setTenantId('');
    setVspcId('');
    onBackToStep1();
  };

  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.tenants.vspc.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.agents.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.baremetals.all });
    navigate(BackupAgentUrls.dashboardTenant);
  };

  if (isLocked) {
    return (
      <div className="ba-tunnel-step-locked flex flex-col gap-3" aria-disabled="true">
        <OdsText preset="heading-4">{t('tunnel:step2_title')}</OdsText>
        <OdsText preset="paragraph">{t('tunnel:step2_locked_hint')}</OdsText>
      </div>
    );
  }

  const showProgress = isPollingPhase(phase) || phase === 'ready';

  return (
    <section className="flex flex-col gap-6" aria-label={t('tunnel:step2_title')}>
      <OdsText preset="heading-4">{t('tunnel:step2_title')}</OdsText>

      <div className="flex flex-col gap-2">
        <OdsText preset="heading-5">{t('tunnel:step2_provisioning_title')}</OdsText>

        {showProgress && (
          <div className="flex flex-col gap-2">
            {phase === 'ready' && (
              <OdsText preset="caption" className="text-center">100%</OdsText>
            )}
            <div
              className="ba-step2-progress-track"
              role="progressbar"
              aria-label={t('tunnel:step2_progress_label')}
              aria-busy={phase !== 'ready'}
              {...(phase === 'ready'
                ? { 'aria-valuenow': 100, 'aria-valuemin': 0, 'aria-valuemax': 100 }
                : {})}
            >
              {phase === 'ready' ? (
                <div className="ba-step2-progress-bar-full" />
              ) : (
                <div className="ba-step2-progress-bar-indeterminate" />
              )}
            </div>
            {phase !== 'ready' && (
              <OdsText preset="paragraph">{t('tunnel:step2_creating')}</OdsText>
            )}
          </div>
        )}

        {phase === 'ready' && (
          <div className="flex items-center gap-3 mt-4">
            <OdsIcon name={ODS_ICON_NAME.check} className="ba-step2-provisioning-check" />
            <OdsText preset="paragraph">{t('tunnel:step2_ready_description')}</OdsText>
          </div>
        )}
      </div>

      {phase === 'error-creation' && (
        <>
          <OdsMessage color="critical" isDismissible={false} className="w-full">
            {t('tunnel:step2_error_creation')}
          </OdsMessage>
          <div className="flex gap-3">
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('tunnel:retry')}
              onClick={handleRetry}
            />
            <OdsButton
              variant={ODS_BUTTON_VARIANT.ghost}
              label={t('tunnel:back_to_step1')}
              onClick={handleBackToStep1}
            />
          </div>
        </>
      )}

      {phase === 'error-network' && (
        <>
          <OdsMessage color="warning" isDismissible={false} className="w-full">
            {t('tunnel:step2_error_network')}
          </OdsMessage>
          <div>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('tunnel:retry')}
              onClick={handleRetry}
            />
          </div>
        </>
      )}

      {phase === 'timeout' && (
        <OdsMessage color="warning" isDismissible={false} className="w-full">
          <div className="flex flex-col gap-2">
            <span>{t('tunnel:step2_timeout')}</span>
            <Links
              href={TUNNEL_LINKS.support}
              target="_blank"
              type={LinkType.external}
              label={t('tunnel:support_link')}
            />
          </div>
        </OdsMessage>
      )}

      {isAgentPanelVisible && (
        <AgentInstallationPanel tenantId={tenantId} vspcId={vspcId} enabled={isAgentPanelVisible} os={serverData!.os} />
      )}

      {phase === 'ready' && (
        <div>
          <OdsButton
            ref={continueButtonRef}
            label={t('tunnel:continue')}
            onClick={handleContinue}
          />
        </div>
      )}

      <div className="sr-only" aria-live="polite" role="status">
        {phase === 'ready' ? t('tunnel:step2_ready_announce') : ''}
      </div>
    </section>
  );
};

export default Step2Polling;
