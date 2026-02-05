import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

export const ImageHelper: FC = () => {
  const { t } = useTranslation(['creation', 'common']);
  const guide = useGuideLink([
    'DISTRIBUTION_IMAGE',
    'DISTRIBUTION_IMAGE_LIFE_CYCLE',
  ]);

  return (
    <HelpDrawer>
      <Text preset="heading-2">
        {t('creation:pci_instance_creation_select_image_help_title')}
      </Text>
      <Text preset="paragraph" className="py-4">
        {t('creation:pci_instance_creation_select_image_help_text')}
      </Text>
      <Link
        className="visited:text-[var(--ods-color-primary-500)]"
        href={guide.DISTRIBUTION_IMAGE}
        target="_blank"
      >
        {t('common:pci_instances_common_more_info')}
      </Link>
      <div className="mt-4">
        <Link
          className="visited:text-[var(--ods-color-primary-500)]"
          href={guide.DISTRIBUTION_IMAGE_LIFE_CYCLE}
          target="_blank"
        >
          {t(
            'creation:pci_instance_creation_select_image_life_cycle_help_label',
          )}
        </Link>
      </div>
    </HelpDrawer>
  );
};
