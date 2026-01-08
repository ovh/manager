import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DrawerOpenChangeDetail, Text } from '@ovhcloud/ods-react';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import GuideLink from '@/components/guideLink/GuideLink.component';

export const SshKeyHelper: FC = () => {
  const { t } = useTranslation('creation');
  const guide = useGuideLink('SSH_KEY');
  const { trackClick } = useOvhTracking();

  const HELPER_TRANSLATION_KEYS = [
    'description',
    'content_list',
    'goal',
    'how_to',
  ];

  const handleTracking = ({ open }: DrawerOpenChangeDetail) => {
    if (open) {
      trackClick({
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['add_instance', 'see-helper_ssh_key'],
      });
    }
  };

  return (
    <HelpDrawer onOpenChange={handleTracking}>
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
      <GuideLink href={guide}>
        {t(
          'creation:pci_instance_creation_select_sshKey_help_read_complete_guide',
        )}
      </GuideLink>
    </HelpDrawer>
  );
};
