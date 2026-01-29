import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button, Badge, Table } from '@ovhcloud/ods-react';
import {
  useVeeamBackup,
  useRestorePoints,
  useRestoreVeeamBackup,
  useDetachVeeamBackup,
} from '@/api/hooks/useVeeam';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { formatDateTime } from '@/domain/services/vpsTransform.service';
import type { TRestorePoint } from '@/domain/entities/veeam';

export const VeeamPage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();

  const [selectedRestorePoint, setSelectedRestorePoint] =
    useState<TRestorePoint | null>(null);

  const { data: veeamBackup, isLoading } = useVeeamBackup(serviceName ?? '');
  const { data: restorePoints, isLoading: restorePointsLoading } =
    useRestorePoints(serviceName ?? '');
  const restoreMutation = useRestoreVeeamBackup();
  const detachMutation = useDetachVeeamBackup();

  const handleRestoreFile = (restorePoint: TRestorePoint) => {
    restoreMutation.mutate({
      serviceName: serviceName ?? '',
      restorePointId: restorePoint.id,
      export: true,
      full: false,
    });
  };

  const handleRestoreFull = (restorePoint: TRestorePoint) => {
    if (
      window.confirm(
        'This will replace all data on your VPS. Are you sure?',
      )
    ) {
      restoreMutation.mutate({
        serviceName: serviceName ?? '',
        restorePointId: restorePoint.id,
        full: true,
        changePassword: true,
      });
    }
  };

  const handleDetach = () => {
    detachMutation.mutate(serviceName ?? '');
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  if (!veeamBackup) {
    return (
      <Card className="p-6">
        <Text preset="heading-4" className="mb-2">
          {t('vps_veeam_title')}
        </Text>
        <Text preset="paragraph" className="text-gray-600">
          {t('vps_veeam_not_enabled')}
        </Text>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Text preset="heading-4" className="mb-2">
          {t('vps_veeam_title')}
        </Text>
        <Text preset="paragraph" className="mb-6 text-gray-600">
          {t('vps_veeam_description')}
        </Text>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Text preset="caption" className="text-gray-500">
              {t('vps_veeam_status')}
            </Text>
            <Badge
              color={veeamBackup.state === 'enabled' ? 'success' : 'warning'}
              label={veeamBackup.state}
            />
          </div>

          <div>
            <Text preset="caption" className="text-gray-500">
              {t('vps_veeam_schedule')}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {veeamBackup.scheduledTime ?? '-'}
            </Text>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            label={t('vps_veeam_reschedule')}
            onClick={() => {
              /* TODO: Open reschedule modal */
            }}
          />
          <Button
            variant="outline"
            color="critical"
            label={t('vps_veeam_detach')}
            onClick={handleDetach}
            isLoading={detachMutation.isPending}
          />
        </div>
      </Card>

      <Card className="p-6">
        <Text preset="heading-5" className="mb-4">
          {t('vps_veeam_restore_points')}
        </Text>

        {restorePointsLoading ? (
          <LoadingSkeleton lines={3} />
        ) : restorePoints && restorePoints.length > 0 ? (
          <Table className="w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left">{t('vps_snapshot_info_date')}</th>
                  <th className="p-4 text-left">{t('vps_snapshot_info_state')}</th>
                  <th className="p-4 text-left" />
                </tr>
              </thead>
              <tbody>
                {restorePoints.map((point) => (
                  <tr key={point.id}>
                    <td className="p-4">{formatDateTime(point.creationDate)}</td>
                    <td className="p-4">
                      <Badge
                        color={point.state === 'available' ? 'success' : 'warning'}
                        label={point.state}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          label={t('vps_veeam_restore_file')}
                          onClick={() => handleRestoreFile(point)}
                          isDisabled={point.state !== 'available'}
                          isLoading={
                            restoreMutation.isPending &&
                            restoreMutation.variables?.restorePointId === point.id
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          color="critical"
                          label={t('vps_veeam_restore_full')}
                          onClick={() => handleRestoreFull(point)}
                          isDisabled={point.state !== 'available'}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        ) : (
          <Text preset="paragraph" className="text-gray-600">
            No restore points available.
          </Text>
        )}
      </Card>
    </div>
  );
};

export default VeeamPage;
