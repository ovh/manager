import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

const FlavorHelper: FC = () => {
  const { t } = useTranslation(['creation', NAMESPACES.ONBOARDING]);
  const guide = useGuideLink('FLAVOR');

  return (
    <HelpDrawer>
      <Text preset="heading-2">
        {t('pci_instance_creation_select_flavor_help_title')}
      </Text>
      <Text preset="paragraph" className="py-4">
        {t('pci_instance_creation_select_flavor_help_description')}
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p1" />
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p2" />
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p3" />
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p4" />
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p5" />
      </Text>
      <Text preset="paragraph" className="py-4">
        <Trans t={t} i18nKey="pci_instance_creation_select_flavor_help_p6" />
      </Text>
      <Link
        className="visited:text-[var(--ods-color-primary-500)]"
        href={guide}
        target="_blank"
      >
        {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      </Link>
    </HelpDrawer>
  );
};

export default FlavorHelper;
