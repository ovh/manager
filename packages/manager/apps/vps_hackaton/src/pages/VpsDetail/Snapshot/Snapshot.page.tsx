import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button, Badge } from '@ovhcloud/ods-react';
import { useSnapshot, useDeleteSnapshot, useDownloadSnapshot } from '@/api/hooks/useSnapshot';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { formatDateTime } from '@/domain/services/vpsTransform.service';
import { CreateSnapshotModal } from './components/CreateSnapshotModal.component';
import { RestoreSnapshotModal } from './components/RestoreSnapshotModal.component';

export const SnapshotPage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const { data: snapshot, isLoading } = useSnapshot(serviceName ?? '');
  const deleteSnapshotMutation = useDeleteSnapshot();
  const downloadSnapshotMutation = useDownloadSnapshot();

  const handleDelete = () => {
    if (window.confirm(t('vps_snapshot_delete_confirm'))) {
      deleteSnapshotMutation.mutate(serviceName ?? '');
    }
  };

  const handleDownload = () => {
    downloadSnapshotMutation.mutate(serviceName ?? '', {
      onSuccess: (url) => {
        window.open(url, '_blank');
      },
    });
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  return (
    <>
      <Card className="p-6">
        <Text preset="heading-4" className="mb-2">
          {t('vps_snapshot_title')}
        </Text>
        <Text preset="paragraph" className="mb-6 text-gray-600">
          {t('vps_snapshot_description')}
        </Text>

        {!snapshot ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <Text preset="heading-5" className="mb-2">
              {t('vps_snapshot_no_snapshot')}
            </Text>
            <Text preset="paragraph" className="mb-4 text-gray-600">
              {t('vps_snapshot_no_snapshot_description')}
            </Text>
            <Button
              variant="default"
              label={t('vps_snapshot_create')}
              onClick={() => setShowCreateModal(true)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Text preset="caption" className="text-gray-500">
                  {t('vps_snapshot_info_date')}
                </Text>
                <Text preset="paragraph" className="font-medium">
                  {formatDateTime(snapshot.creationDate)}
                </Text>
              </div>

              <div>
                <Text preset="caption" className="text-gray-500">
                  {t('vps_snapshot_info_description')}
                </Text>
                <Text preset="paragraph" className="font-medium">
                  {snapshot.description ?? '-'}
                </Text>
              </div>

              <div>
                <Text preset="caption" className="text-gray-500">
                  {t('vps_snapshot_info_state')}
                </Text>
                <Badge
                  color={snapshot.state === 'created' ? 'success' : 'warning'}
                  label={snapshot.state}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                label={t('vps_snapshot_restore')}
                onClick={() => setShowRestoreModal(true)}
                isDisabled={snapshot.state !== 'created'}
              />
              <Button
                variant="outline"
                label={t('vps_snapshot_download')}
                onClick={handleDownload}
                isLoading={downloadSnapshotMutation.isPending}
                isDisabled={snapshot.state !== 'created'}
              />
              <Button
                variant="outline"
                color="critical"
                label={t('vps_snapshot_delete')}
                onClick={handleDelete}
                isLoading={deleteSnapshotMutation.isPending}
                isDisabled={snapshot.state !== 'created'}
              />
            </div>
          </div>
        )}
      </Card>

      {showCreateModal && (
        <CreateSnapshotModal
          serviceName={serviceName ?? ''}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showRestoreModal && (
        <RestoreSnapshotModal
          serviceName={serviceName ?? ''}
          onClose={() => setShowRestoreModal(false)}
        />
      )}
    </>
  );
};

export default SnapshotPage;
