import { Divider, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { SshKeyHelper } from './sshKey/SshKeyHelper.component';
import { useSshKeys } from '@/data/hooks/ssh/useSshKeys';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { selectSshKeys } from '../view-models/sshKeysViewModel';
import { useMemo } from 'react';

type TSshKeyProps = {
  microRegion: string;
};

const SshKey = ({ microRegion }: TSshKeyProps) => {
  const projectId = useProjectId();
  const { t } = useTranslation('creation');

  const { isLoading } = useSshKeys(microRegion);

  const sshKeys = useMemo(
    () => (isLoading ? [] : selectSshKeys(deps)(projectId, microRegion)),
    [isLoading, microRegion, projectId],
  );

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
