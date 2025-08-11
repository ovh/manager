import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { OvhSubsidiary, useProjectUrl } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { useIsQuotaAboveThreshold, useQuotas } from '@/data/hooks/useQuota';
import { QUOTA_LIMIT_GUIDES } from '@/constants';

export default function QuotaAlert() {
  const { t } = useTranslation('project');
  const projectId = useProjectIdFromParams();

  const { data: quotas, isLoading } = useQuotas(projectId);
  const isQuotaAboveThreshold = useIsQuotaAboveThreshold(quotas ?? []);
  const { data: project } = useProject(projectId);
  const isDiscovery = isDiscoveryProject(project);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const quotaGuidesLink =
    QUOTA_LIMIT_GUIDES[ovhSubsidiary as OvhSubsidiary] ||
    QUOTA_LIMIT_GUIDES.DEFAULT ||
    '';

  const hrefProject = useProjectUrl('public-cloud');
  const quotaUrl = `${hrefProject}/quota`;

  if (isLoading || !isQuotaAboveThreshold || isDiscovery) {
    return null;
  }

  return (
    <div className="my-6 w-full">
      <OdsMessage
        color="warning"
        isDismissible={false}
        data-testid="quota-alert_message"
      >
        <OdsText>
          <Trans
            t={t}
            i18nKey="pci_projects_project_quota_threshold_warning_message"
            components={{
              quotaGuidesLink: (
                <OdsLink
                  href={quotaGuidesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="external-link"
                  data-testid="quota-alert_guides-link"
                />
              ),
              quotaUrl: (
                <OdsLink
                  href={quotaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="quota-alert_quota-url"
                />
              ),
            }}
          />
        </OdsText>
      </OdsMessage>
    </div>
  );
}
