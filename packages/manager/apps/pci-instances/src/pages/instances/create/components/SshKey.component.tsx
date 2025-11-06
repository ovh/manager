import {
  Divider,
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { SshKeyHelper } from './sshKey/SshKeyHelper.component';
import { useSshKeys } from '@/data/hooks/ssh/useSshKeys';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { selectSshKeys } from '../view-models/sshKeysViewModel';

type TSshKeyProps = {
  microRegion: string;
};
import AddSshKey from './sshKey/AddSshKey.component';

const SshKey = ({ microRegion }: TSshKeyProps) => {
  const projectId = useProjectId();
  const { t } = useTranslation('creation');

  const { isLoading } = useSshKeys(microRegion);

  const sshKeys = selectSshKeys(deps)(projectId, microRegion);

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
      {!isLoading && (
        <>
          {sshKeys.length === 0 && (
            <div className="mt-4">
              <Message color="warning">
                <MessageIcon name={ICON_NAME.triangleExclamation} />
                <MessageBody>
                  {t(
                    'creation:pci_instance_creation_select_sshKey_missing_warning',
                  )}
                </MessageBody>
              </Message>
            </div>
          )}
          <AddSshKey openForm={!sshKeys} />
        </>
      )}
    </section>
  );
};

export default SshKey;
