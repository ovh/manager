import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DrawerOpenChangeDetail, Icon, Link, Text } from '@ovhcloud/ods-react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import GuideLink from '@/components/guideLink/GuideLink.component';

const HELPER_TRANSLATION_KEYS = [
  'auto_backup_description',
  'custom_backup_description',
  'replication_description',
  'ui_guide',
];

const BackupHelper: FC = () => {
  const { t } = useTranslation(['creation', 'common']);
  const { trackClick } = useOvhTracking();
  const projectUrl = useProjectUrl('public-cloud');
  const guide = useGuideLink('BACKUP');

  const handleTrackingClick = (
    buttonType: ButtonType.externalLink | ButtonType.link,
  ) =>
    trackClick({
      location: PageLocation.funnel,
      buttonType,
      actionType: 'action',
      actions: ['add_instance', 'go-to-see-documentation_backup'],
    });

  const handleOpenGuideLink = () =>
    handleTrackingClick(ButtonType.externalLink);

  const handleOpenHelper = ({ open }: DrawerOpenChangeDetail) => {
    if (open) {
      handleTrackingClick(ButtonType.link);
    }
  };

  return (
    <HelpDrawer onOpenChange={handleOpenHelper}>
      <Text preset="heading-2">
        {t('creation:pci_instance_creation_backup_setting_help_title')}
      </Text>
      <Text preset="paragraph" className="py-6">
        {t('creation:pci_instance_creation_backup_setting_help_description')}
      </Text>
      {HELPER_TRANSLATION_KEYS.map((key) => (
        <article key={key}>
          <Trans
            t={t}
            i18nKey={`creation:pci_instance_creation_backup_setting_help_${key}`}
            components={{
              h6: <Text preset="heading-6" />,
              p: <Text preset="paragraph" className="py-6" />,
              CreateBackupAction: (
                <Link
                  href={`${projectUrl}/workflow`}
                  className="mb-6 visited:text-[var(--ods-color-primary-500)]"
                  role="link"
                >
                  {t(
                    'creation:pci_instance_creation_backup_setting_action_label',
                  )}
                  <Icon name="arrow-right" />
                </Link>
              ),
              Link: (
                <GuideLink
                  href={guide}
                  onClick={handleOpenGuideLink}
                  target="_blank"
                />
              ),
            }}
          />
        </article>
      ))}
    </HelpDrawer>
  );
};

export default BackupHelper;
