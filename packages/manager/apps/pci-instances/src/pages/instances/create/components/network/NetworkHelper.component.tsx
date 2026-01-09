import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DrawerOpenChangeDetail, Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

const NetworkHelper: FC = () => {
  const { t } = useTranslation(['creation', 'common']);
  const { trackClick } = useOvhTracking();
  const guide = useGuideLink('NETWORK');

  const handleOpenGuideLink = () =>
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.externalLink,
      actionType: 'action',
      actions: ['add_instance', 'go-to-see-documentation_network'],
    });

  const handleOpenHelper = ({ open }: DrawerOpenChangeDetail) => {
    if (open) {
      trackClick({
        location: PageLocation.popup,
        actionType: 'action',
        actions: ['add_instance', 'see-helper_network'],
      });
    }
  };

  return (
    <HelpDrawer onOpenChange={handleOpenHelper}>
      <Text preset="heading-2">
        {t('creation:pci_instance_creation_network_setting_help_title')}
      </Text>
      <Link
        className="visited:text-[var(--ods-color-primary-500)]"
        href={guide}
        onClick={handleOpenGuideLink}
        target="_blank"
      >
        {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      </Link>
    </HelpDrawer>
  );
};

export default NetworkHelper;
