import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink, OsdsProgressBar, OsdsText } from '@ovhcloud/ods-components/react';

import { useBytes, useParam } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useGetClusterEtcdUsage } from '@/api/hooks/useKubernetes';
import { QUOTA_ERROR_URL, getColorByPercentage } from '@/helpers';

const getProgressBarStyle = (color: string) => `
  progress[value] {
    --progress: calc(var(--w) * (attr(value) / 100)); 
    --color: ${color};
    --background: lightgrey; 
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
  const { projectId, kubeId } = useParam('projectId', 'kubeId');

  const { formatBytes } = useBytes();

  const { data: { usage: used, quota: total } = {} } = useGetClusterEtcdUsage(projectId, kubeId);
  const percentage = useMemo(() => (used / total) * 100, [used, total]);
  const { t } = useTranslation(['service']);
  const { addWarning } = useNotifications();

  useEffect(() => {
    if (percentage >= 80) {
      addWarning(
        <>
          <span className="text-[#995400]">{t('kube_service_etcd_quota_error')}</span>

          <br />
          <OsdsLink
            className="mt-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={QUOTA_ERROR_URL}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {' '}
            {t('kube_service_etcd_quota_error_link')}
            <span slot="end">
              <OsdsIcon
                aria-hidden="true"
                className="ml-4"
                name={ODS_ICON_NAME.EXTERNAL_LINK}
                hoverable
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
          </OsdsLink>
        </>,
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
  }, [percentage]);

  return (
    <div className="w-full p-3 my-4">
      <OsdsProgressBar color={getColorByPercentage(percentage)} value={percentage} max={100} />
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.text}
        className="mt-4 float-right"
      >
        {formatBytes(used, 2, 1024)} / {formatBytes(total, 2, 1024)}
      </OsdsText>
    </div>
  );
}
export default ClusterEtcd;
