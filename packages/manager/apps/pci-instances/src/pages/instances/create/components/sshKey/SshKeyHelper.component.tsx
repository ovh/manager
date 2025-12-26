import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';

export const SshKeyHelper: FC = () => {
  const { t } = useTranslation('creation');
  const guide = useGuideLink('SSH_KEY');

  const HELPER_TRANSLATION_KEYS = [
    'description',
    'content_list',
    'goal',
    'how_to',
  ];

  return (
    <HelpDrawer>
      <Text preset="heading-2">
        {t('creation:pci_instance_creation_select_sshKey_help_title')}
      </Text>
      {HELPER_TRANSLATION_KEYS.map((key) => (
        <div key={key} className="py-4 text-[--ods-color-text]">
          <Trans
            t={t}
            i18nKey={`creation:pci_instance_creation_select_sshKey_help_${key}`}
            components={{
              ul: <ul className="my-0 py-3 pe-4" />,
              ol: <ol className="my-0 py-3 pe-4" />,
              li: <li />,
            }}
          />
        </div>
      ))}
      <Link
        className="visited:text-[var(--ods-color-primary-500)]"
        href={guide}
        target="_blank"
      >
        {t(
          'creation:pci_instance_creation_select_sshKey_help_read_complete_guide',
        )}
      </Link>
    </HelpDrawer>
  );
};
