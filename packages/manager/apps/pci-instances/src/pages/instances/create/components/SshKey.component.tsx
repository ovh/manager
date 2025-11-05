import { FC } from 'react';
import { Divider, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { SshKeyHelper } from './sshKey/SshKeyHelper.component';

const SshKey: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <Divider spacing="64" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_select_sshKey_title')}
        </Text>
        <SshKeyHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('creation:pci_instance_creation_select_sshKey_description')}
      </Text>
    </section>
  );
};

export default SshKey;
