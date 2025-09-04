import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { CardSection } from '@/components/CardSection';
import { StatusBadge } from '@/components/StatusBadge';
import { CommonCard } from '@/components/CommonCard';

type TSecurityPermissionsCardProps = {
  displayEncryptionData: boolean;
  isEncrypted: boolean;
  showEnableEncryptionLink: boolean;
  enableEncryptionHref: string;
  isLocalZone: boolean;
};

export const SecurityPermissionsCard = ({
  displayEncryptionData,
  isEncrypted,
  showEnableEncryptionLink,
  enableEncryptionHref,
  isLocalZone,
}: TSecurityPermissionsCardProps) => {
  const { t } = useTranslation([
    'container',
    'dashboard',
    'containers/enable-versioning',
  ]);

  const renderEncryptionContent = () => {
    if (!displayEncryptionData || isLocalZone) return null;

    if (!isEncrypted) {
      return (
        <>
          <div className="mb-4">
            <StatusBadge
              status="disabled"
              translationKey="containers/enable-versioning:pci_projects_project_storages_containers_update_versioning"
              color="warning"
            />
          </div>
          {showEnableEncryptionLink && (
            <Links
              label={t(
                'dashboard:pci_projects_project_storages_dashboard_enable_encryption',
              )}
              type={LinkType.next}
              href={enableEncryptionHref}
            />
          )}
        </>
      );
    }

    return (
      <>
        <div className="mb-4">
          <StatusBadge
            status="enabled"
            translationKey="containers/enable-versioning:pci_projects_project_storages_containers_update_versioning"
            color="success"
          />
        </div>
        <div className="flex items-center text-[#4d5592]">
          {t(
            'dashboard:pci_projects_project_storages_dashboard_data_encryption_enabled',
          )}
        </div>
      </>
    );
  };

  return (
    <CommonCard
      title={t(
        'dashboard:pci_projects_project_storages_dashboard_security_permissions',
      )}
    >
      <CardSection
        title={t(
          'dashboard:pci_projects_project_storages_dashboard_default_encryption',
        )}
        showDivider={false}
      >
        {renderEncryptionContent()}
      </CardSection>
    </CommonCard>
  );
};
