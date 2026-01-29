import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button } from '@ovhcloud/ods-react';
import type { TVps } from '@/domain/entities/vps';
import {
  canReboot,
  canStop,
  canStart,
  canRescue,
  canReinstall,
} from '@/domain/services/vpsState.service';
import {
  useRebootVps,
  useStopVps,
  useStartVps,
  useExitRescueMode,
} from '@/api/hooks/useVpsActions';
import { RescueModal } from './RescueModal.component';
import { KvmConsole } from './KvmConsole.component';
import { ResetPasswordModal } from './ResetPasswordModal.component';
import { RebuildWizard } from './RebuildWizard.component';

type TVpsQuickActionsProps = {
  vps: TVps;
};

export const VpsQuickActions = ({ vps }: TVpsQuickActionsProps) => {
  const { t } = useTranslation('vps');

  const [showRescueModal, setShowRescueModal] = useState(false);
  const [showKvmConsole, setShowKvmConsole] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showRebuildWizard, setShowRebuildWizard] = useState(false);

  const rebootMutation = useRebootVps();
  const stopMutation = useStopVps();
  const startMutation = useStartVps();
  const exitRescueMutation = useExitRescueMode();

  const handleReboot = () => {
    if (window.confirm(t('vps_action_reboot_confirm_message'))) {
      rebootMutation.mutate({ serviceName: vps.serviceName });
    }
  };

  const handleStop = () => {
    if (window.confirm(t('vps_action_stop_confirm_message'))) {
      stopMutation.mutate({ serviceName: vps.serviceName });
    }
  };

  const handleStart = () => {
    if (window.confirm(t('vps_action_start_confirm_message'))) {
      startMutation.mutate({ serviceName: vps.serviceName });
    }
  };

  const handleExitRescue = () => {
    exitRescueMutation.mutate(vps.serviceName);
  };

  const isInRescue = vps.network.netbootMode === 'rescue';

  return (
    <>
      <Card className="p-6">
        <Text preset="heading-4" className="mb-4">
          {t('vps_dashboard_actions_title')}
        </Text>

        <div className="flex flex-wrap gap-3">
          {canReboot(vps) && (
            <Button
              variant="outline"
              label={t('vps_action_reboot')}
              onClick={handleReboot}
              isLoading={rebootMutation.isPending}
            />
          )}

          {canStop(vps) && (
            <Button
              variant="outline"
              label={t('vps_action_stop')}
              onClick={handleStop}
              isLoading={stopMutation.isPending}
            />
          )}

          {canStart(vps) && (
            <Button
              variant="outline"
              label={t('vps_action_start')}
              onClick={handleStart}
              isLoading={startMutation.isPending}
            />
          )}

          {isInRescue ? (
            <Button
              variant="outline"
              label={t('vps_action_exit_rescue')}
              onClick={handleExitRescue}
              isLoading={exitRescueMutation.isPending}
            />
          ) : (
            canRescue(vps) && (
              <Button
                variant="outline"
                label={t('vps_action_rescue')}
                onClick={() => setShowRescueModal(true)}
              />
            )
          )}

          <Button
            variant="outline"
            label={t('vps_action_kvm')}
            onClick={() => setShowKvmConsole(true)}
          />

          <Button
            variant="outline"
            label={t('vps_action_reset_password')}
            onClick={() => setShowResetPasswordModal(true)}
          />

          {canReinstall(vps) && (
            <Button
              variant="outline"
              color="critical"
              label={t('vps_action_reinstall')}
              onClick={() => setShowRebuildWizard(true)}
            />
          )}
        </div>
      </Card>

      {showRescueModal && (
        <RescueModal
          serviceName={vps.serviceName}
          onClose={() => setShowRescueModal(false)}
        />
      )}

      {showKvmConsole && (
        <KvmConsole
          serviceName={vps.serviceName}
          onClose={() => setShowKvmConsole(false)}
        />
      )}

      {showResetPasswordModal && (
        <ResetPasswordModal
          serviceName={vps.serviceName}
          onClose={() => setShowResetPasswordModal(false)}
        />
      )}

      {showRebuildWizard && (
        <RebuildWizard
          serviceName={vps.serviceName}
          onClose={() => setShowRebuildWizard(false)}
        />
      )}
    </>
  );
};
