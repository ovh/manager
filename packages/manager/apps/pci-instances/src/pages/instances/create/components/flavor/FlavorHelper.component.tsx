import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

const FlavorHelper: FC = () => {
  const { t } = useTranslation(['creation', NAMESPACES.ONBOARDING]);
  const guide = useGuideLink('FLAVOR');

  const HELPER_TRANSLATION_KEYS = [
    'description',
    'general_purpose',
    'compute_optimized',
    'memory_optimized',
    'storage_otpimized',
    'help_gpu',
    'discovery',
  ];

  return (
    <HelpDrawer>
      <Text preset="heading-2">
        {t('pci_instance_creation_select_flavor_help_title')}
      </Text>
      {HELPER_TRANSLATION_KEYS.map((key) => (
        <Text key={key} preset="paragraph" className="py-4">
          <Trans
            t={t}
            i18nKey={`pci_instance_creation_select_flavor_help_${key}`}
          />
        </Text>
      ))}
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
