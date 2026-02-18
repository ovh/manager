import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DrawerOpenChangeDetail, Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

const PublicConnectivityHelper: FC = () => {
  const { t } = useTranslation(['creation', 'common']);
  const { trackClick } = useOvhTracking();
  const guide = useGuideLink('NETWORK_PUBLIC_CONNECTIVITY');

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
        actions: ['add_instance', 'see-helper_public_connectivity'],
      });
    }
  };

  const sectionComponents = {
    h6: (
      <Text
        preset="heading-6"
        className="mb-3 block font-semibold"
      />
    ),
    p: <Text preset="paragraph" className="mb-4 block" />,
  };

  return (
    <HelpDrawer onOpenChange={handleOpenHelper}>
      <div className="flex flex-col pb-20 pt-8">
        <Text preset="heading-2" className="mb-4">
          {t('creation:pci_instance_creation_network_public_connectivity_help_title')}
        </Text>
        <Text preset="paragraph" className="mb-8">
          {t('creation:pci_instance_creation_network_public_connectivity_help_description')}
        </Text>
        <article className="mt-0">
          <Trans
            t={t}
            i18nKey="creation:pci_instance_creation_network_public_connectivity_help_floating_ip"
            components={sectionComponents}
          />
        </article>
        <article className="mt-8">
          <Trans
            t={t}
            i18nKey="creation:pci_instance_creation_network_public_connectivity_help_basic_ip"
            components={sectionComponents}
          />
        </article>
        <Link
          className="mt-8 inline-block visited:text-[var(--ods-color-primary-500)]"
          href={guide}
          onClick={handleOpenGuideLink}
          target="_blank"
        >
          {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
        </Link>
      </div>
    </HelpDrawer>
  );
};

export default PublicConnectivityHelper;
