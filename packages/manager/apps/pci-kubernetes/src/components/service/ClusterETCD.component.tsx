import { useEffect, useMemo } from 'react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OsdsProgressBar, OsdsText } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { useGetClusterEtcdUsage } from '@/api/hooks/useKubernetes';
import { formatBytes, getColorByPercentage, QUOTA_ERROR_URL } from '@/helpers';

const getProgressBarStyle = (color: string) => `
  progress[value] {
    --progress: calc(var(--w) * (attr(value) / 100)); /* Largeur de la progression en fonction du pourcentage */
    --color: ${color};
    --background: lightgrey; /* Couleur de fond */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    background: var(--background);
  }
  progress[value]::-webkit-progress-bar {
    background: var(--background);
  }
  progress[value]::-webkit-progress-value {
    background: var(--color);
  }
  progress[value]::-moz-progress-bar {
    background: var(--color);
  }
`;

function ClusterEtcd() {
  const { projectId, kubeId } = useParams();
  const {
    data: { usage: used, quota: total },
  } = useGetClusterEtcdUsage(projectId, kubeId);
  const percentage = useMemo(() => (used / total) * 100, []);
  const { t } = useTranslation(['service']);
  const { addWarning } = useNotifications();

  useEffect(() => {
    if (percentage > 80) {
      addWarning(
        <Trans components={{ a: <a></a> }}>
          {t('kube_service_etcd_quota_error', {
            link: QUOTA_ERROR_URL,
          })}
        </Trans>,
        true,
      );
    }
  }, [percentage]);

  useEffect(() => {
    const progressBarElement = document.querySelector('osds-progress-bar');
    const { shadowRoot } = progressBarElement;
    const style = document.createElement('style');
    style.textContent = getProgressBarStyle(getColorByPercentage(percentage));
    shadowRoot.appendChild(style);
  }, []);

  return (
    <div className="w-full p-3 my-4">
      <OsdsProgressBar
        color={getColorByPercentage(percentage)}
        value={percentage}
        max={100}
      />
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.text}
        className="mt-4 float-right"
      >
        {formatBytes(used)} / {formatBytes(total)}
      </OsdsText>
    </div>
  );
}

export default ClusterEtcd;
