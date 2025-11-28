import { useState } from 'react';

import { Translation, useTranslation } from 'react-i18next';

import { Button, Icon, Spinner } from '@ovhcloud/ods-react';

import { isApiCustomError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useKubeConfig } from '@/api/hooks/useKubernetes';
import { CONFIG_FILENAME, KUBE_INSTALLING_STATUS } from '@/constants';
import { downloadContent } from '@/helpers';
import { getClusterUrlFragments } from '@/helpers/matchers/matchers';
import { TKube } from '@/types';

export type ClusterConfigFileActionsProps = {
  kubeDetail: TKube;
  projectId: string;
};

export const ClusterConfigFileActions = ({
  kubeDetail,
  projectId,
}: ClusterConfigFileActionsProps) => {
  const [ongoingKubeConfigAction, setOngoingKubeConfigAction] = useState<
    'copy' | 'download' | null
  >(null);

  const { addError } = useNotifications();
  const { t } = useTranslation('service');

  const { mutate: postKubeConfig, isPending: isKubeConfigPending } = useKubeConfig({
    projectId,
    kubeId: kubeDetail.id,
    onError: (error: Error) =>
      addError(
        <Translation ns="service">
          {(_t) =>
            _t('kube_service_file_error', {
              message: isApiCustomError(error)
                ? error?.response?.data?.message
                : (error?.message ?? null),
            })
          }
        </Translation>,
        true,
      ),
  });

  const downloadConfigFile = () => {
    setOngoingKubeConfigAction('download');
    postKubeConfig(undefined, {
      onSuccess: (configFile) => {
        const clusterShortId = getClusterUrlFragments(kubeDetail.url)?.shortId;

        const fileName = clusterShortId
          ? `${CONFIG_FILENAME}-${clusterShortId}.yml`
          : `${CONFIG_FILENAME}.yml`;

        downloadContent({
          fileContent: configFile.content,
          fileName,
        });

        setOngoingKubeConfigAction(null);
      },
    });
  };

  const copyConfigFile = () => {
    setOngoingKubeConfigAction('copy');
    postKubeConfig(undefined, {
      onSuccess: async (configFile) => {
        await navigator.clipboard.writeText(configFile.content);
        setOngoingKubeConfigAction(null);
      },
    });
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center">
        <Button
          size="sm"
          variant="ghost"
          data-testid="ClusterConfigFileActions-CopyKubeConfig"
          disabled={isKubeConfigPending || kubeDetail.status === KUBE_INSTALLING_STATUS}
          onClick={copyConfigFile}
        >
          <Icon name="file-copy" /> {t('kube_service_copy_kubeconfig')}
        </Button>
        {isKubeConfigPending && ongoingKubeConfigAction === 'copy' && (
          <Spinner size="sm" data-testid="clusterConfigFileActions-spinnerCopyKubeConfig" />
        )}
      </div>

      <div className="flex items-center">
        <Button
          size="sm"
          variant="ghost"
          data-testid="ClusterConfigFileActions-DownloadKubeConfig"
          disabled={isKubeConfigPending || kubeDetail.status === KUBE_INSTALLING_STATUS}
          onClick={downloadConfigFile}
        >
          <Icon name="download" /> {t('kube_service_download_kubeconfig')}
        </Button>
        {isKubeConfigPending && ongoingKubeConfigAction === 'download' && (
          <Spinner size="sm" data-testid="clusterConfigFileActions-spinnerDownloadKubeConfig" />
        )}
      </div>
    </div>
  );
};
