import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DrawerOpenChangeDetail, Text } from '@ovhcloud/ods-react';
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
      <div className="flex flex-col pb-20 pt-8">
        <Text preset="heading-2" className="mb-4">
          {t('creation:pci_instance_creation_backup_setting_help_title')}
        </Text>
        <Text preset="paragraph" className="mb-8">
          <Trans
            t={t}
            i18nKey="creation:pci_instance_creation_backup_setting_help_description"
            components={{ semibold: <span className="font-semibold" /> }}
          />
        </Text>
        {HELPER_TRANSLATION_KEYS.map((key, index) => (
          <article key={key} className={index === 0 ? 'mt-0' : 'mt-8'}>
            <Trans
              t={t}
              i18nKey={`creation:pci_instance_creation_backup_setting_help_${key}`}
              components={{
                h6: (
                  <Text preset="heading-6" className="mb-3 block font-bold" />
                ),
                p: <Text preset="paragraph" className="mb-4 block" />,
                CreateBackupAction: (
                  <GuideLink
                    href={`${projectUrl}/workflow`}
                    className="my-4 block"
                  />
                ),
                Link: (
                  <GuideLink
                    href={guide}
                    onClick={handleOpenGuideLink}
                    className="my-4 block"
                  />
                ),
              }}
            />
          </article>
        ))}
      </div>
    </HelpDrawer>
  );
};

export default BackupHelper;
