import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Text,
  Card,
  Button,
  Table,
  Input,
  Checkbox,
} from '@ovhcloud/ods-react';
import {
  useBackupStorage,
  useBackupStorageAcls,
  useResetBackupStoragePassword,
  useAddBackupStorageAcl,
  useDeleteBackupStorageAcl,
} from '@/api/hooks/useBackupStorage';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { formatDiskSize } from '@/domain/services/vpsTransform.service';

export const BackupStoragePage = () => {
  const { t } = useTranslation('vps');
  const { serviceName } = useParams<{ serviceName: string }>();

  const [showAddAcl, setShowAddAcl] = useState(false);
  const [newAcl, setNewAcl] = useState({
    ipBlock: '',
    ftp: true,
    nfs: false,
    cifs: false,
  });

  const { data: backupStorage, isLoading } = useBackupStorage(serviceName ?? '');
  const { data: acls, isLoading: aclsLoading } = useBackupStorageAcls(
    serviceName ?? '',
  );
  const resetPasswordMutation = useResetBackupStoragePassword();
  const addAclMutation = useAddBackupStorageAcl();
  const deleteAclMutation = useDeleteBackupStorageAcl();

  const handleResetPassword = () => {
    resetPasswordMutation.mutate(serviceName ?? '', {
      onSuccess: (data) => {
        alert(`New password: ${data.password}`);
      },
    });
  };

  const handleAddAcl = () => {
    addAclMutation.mutate(
      {
        serviceName: serviceName ?? '',
        ...newAcl,
      },
      {
        onSuccess: () => {
          setShowAddAcl(false);
          setNewAcl({ ipBlock: '', ftp: true, nfs: false, cifs: false });
        },
      },
    );
  };

  const handleDeleteAcl = (ipBlock: string) => {
    if (window.confirm(`Delete ACL for ${ipBlock}?`)) {
      deleteAclMutation.mutate({
        serviceName: serviceName ?? '',
        ipBlock,
      });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  if (!backupStorage) {
    return (
      <Card className="p-6">
        <Text preset="heading-4" className="mb-2">
          {t('vps_backup_storage_title')}
        </Text>
        <Text preset="paragraph" className="text-gray-600">
          {t('vps_backup_storage_not_enabled')}
        </Text>
      </Card>
    );
  }

  const usagePercent = Math.round(
    (backupStorage.usage / backupStorage.quota) * 100,
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Text preset="heading-4" className="mb-2">
          {t('vps_backup_storage_title')}
        </Text>
        <Text preset="paragraph" className="mb-6 text-gray-600">
          {t('vps_backup_storage_description')}
        </Text>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Text preset="caption" className="text-gray-500">
              {t('vps_backup_storage_quota')}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {formatDiskSize(backupStorage.quota / 1024 / 1024 / 1024)}
            </Text>
          </div>

          <div>
            <Text preset="caption" className="text-gray-500">
              {t('vps_backup_storage_usage')}
            </Text>
            <Text preset="paragraph" className="font-medium">
              {formatDiskSize(backupStorage.usage / 1024 / 1024 / 1024)} (
              {usagePercent}%)
            </Text>
          </div>

          <div>
            <Text preset="caption" className="text-gray-500">
              {t('vps_backup_storage_ftp_url')}
            </Text>
            <Text preset="paragraph" className="font-mono text-sm">
              {backupStorage.ftpUrl}
            </Text>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            label={t('vps_backup_storage_reset_password')}
            onClick={handleResetPassword}
            isLoading={resetPasswordMutation.isPending}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <Text preset="heading-5">
            {t('vps_backup_storage_acl_title')}
          </Text>
          <Button
            variant="default"
            label={t('vps_backup_storage_acl_add')}
            onClick={() => setShowAddAcl(true)}
          />
        </div>

        {showAddAcl && (
          <div className="mb-4 rounded-lg border bg-gray-50 p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Input
                type="text"
                name="ipBlock"
                placeholder="192.168.0.0/24"
                value={newAcl.ipBlock}
                onChange={(e) =>
                  setNewAcl({ ...newAcl, ipBlock: e.detail.value as string })
                }
              />
              <label className="flex items-center gap-2">
                <Checkbox
                  isChecked={newAcl.ftp}
                  onChange={(e) =>
                    setNewAcl({ ...newAcl, ftp: e.detail.checked })
                  }
                />
                FTP
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  isChecked={newAcl.nfs}
                  onChange={(e) =>
                    setNewAcl({ ...newAcl, nfs: e.detail.checked })
                  }
                />
                NFS
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  isChecked={newAcl.cifs}
                  onChange={(e) =>
                    setNewAcl({ ...newAcl, cifs: e.detail.checked })
                  }
                />
                CIFS
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                label={t('common_cancel')}
                onClick={() => setShowAddAcl(false)}
              />
              <Button
                variant="default"
                label={t('common_save')}
                onClick={handleAddAcl}
                isLoading={addAclMutation.isPending}
                isDisabled={!newAcl.ipBlock}
              />
            </div>
          </div>
        )}

        {aclsLoading ? (
          <LoadingSkeleton lines={3} />
        ) : acls && acls.length > 0 ? (
          <Table className="w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left">IP Block</th>
                  <th className="p-4 text-center">FTP</th>
                  <th className="p-4 text-center">NFS</th>
                  <th className="p-4 text-center">CIFS</th>
                  <th className="p-4 text-left" />
                </tr>
              </thead>
              <tbody>
                {acls.map((acl) => (
                  <tr key={acl.ipBlock}>
                    <td className="p-4 font-mono">{acl.ipBlock}</td>
                    <td className="p-4 text-center">{acl.ftp ? '✓' : '-'}</td>
                    <td className="p-4 text-center">{acl.nfs ? '✓' : '-'}</td>
                    <td className="p-4 text-center">{acl.cifs ? '✓' : '-'}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        color="critical"
                        label={t('vps_backup_storage_acl_delete')}
                        onClick={() => handleDeleteAcl(acl.ipBlock)}
                        isLoading={
                          deleteAclMutation.isPending &&
                          deleteAclMutation.variables?.ipBlock === acl.ipBlock
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        ) : (
          <Text preset="paragraph" className="text-gray-600">
            No ACLs configured.
          </Text>
        )}
      </Card>
    </div>
  );
};

export default BackupStoragePage;
