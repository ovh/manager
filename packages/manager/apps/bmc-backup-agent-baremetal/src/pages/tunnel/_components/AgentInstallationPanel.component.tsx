import { useId, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCode,
  OdsFormField,
  OdsIcon,
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
  OdsTab,
  OdsTabs,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { LinkType, Links } from '@ovh-ux/manager-react-components';

import { useManagementAgent } from '@/data/hooks/tunnel/useTunnelPolling.hook';
import { useTunnelLinks } from '@/hooks/useTunnelLinks';
import { TunnelOs } from '@/types/Tunnel.type';
import { getWindowsCommand, triggerDownload } from '@/utils/agentCommands';
import { OS_OPTIONS } from '@/utils/tunnel.constants';

export type AgentInstallationPanelProps = {
  tenantId: string;
  vspcId: string;
  /** Enabled once tenantId + vspcId resolve (phase `polling-status` or `ready`). */
  enabled: boolean;
};

type AgentTab = 'terminal' | 'manual';

export const AgentInstallationPanel = ({
  tenantId,
  vspcId,
  enabled,
}: AgentInstallationPanelProps) => {
  const { t } = useTranslation('tunnel');
  const selectOsId = useId();
  const copyFeedbackId = useId();

  const tunnelLinks = useTunnelLinks();

  const [selectedOs, setSelectedOs] = useState<TunnelOs | ''>('');
  const [activeTab, setActiveTab] = useState<AgentTab>('terminal');
  const [copyAnnouncement, setCopyAnnouncement] = useState('');

  const {
    data: agentLinks,
    isPending,
    isError,
    refetch,
  } = useManagementAgent(tenantId, vspcId, enabled);

  const activeDownloadUrl =
    selectedOs === 'LINUX'
      ? agentLinks?.linuxUrl
      : selectedOs === 'WINDOWS'
        ? agentLinks?.windowsUrl
        : undefined;

  const isDownloadEnabled = !!selectedOs && !!activeDownloadUrl && !isPending;

  const announceCopy = () => {
    setCopyAnnouncement(t('tunnel:agent_copy_announced'));
  };

  const renderTerminalTab = () => {
    if (!selectedOs) {
      return <OdsText preset="caption">{t('tunnel:agent_terminal_placeholder')}</OdsText>;
    }
    if (isPending) {
      return <OdsSkeleton style={{ width: '100%', height: '36px' }} />;
    }
    if (selectedOs === 'LINUX') {
      const script = agentLinks?.linuxDeployScript;
      if (!script) {
        return <OdsText preset="caption">{t('tunnel:agent_url_unavailable')}</OdsText>;
      }
      return (
        <section className="flex flex-col gap-4" aria-label={t('tunnel:agent_terminal_label')}>
          <OdsCode
            className="break-all"
            labelCopy={t('tunnel:agent_copy')}
            labelCopySuccess={t('tunnel:agent_copied')}
            onOdsCopy={announceCopy}
          >
            {script}
          </OdsCode>
        </section>
      );
    }
    const url = agentLinks?.windowsUrl;
    if (!url) {
      return <OdsText preset="caption">{t('tunnel:agent_url_unavailable')}</OdsText>;
    }
    return (
      <section className="flex flex-col gap-4" aria-label={t('tunnel:agent_terminal_label')}>
        <OdsCode
          className="break-all"
          labelCopy={t('tunnel:agent_copy')}
          labelCopySuccess={t('tunnel:agent_copied')}
          onOdsCopy={announceCopy}
        >
          {getWindowsCommand(url)}
        </OdsCode>
      </section>
    );
  };

  const renderManualTab = () => {
    if (isPending && !!selectedOs) {
      return <OdsSkeleton style={{ width: '120px', height: '36px' }} />;
    }
    return (
      <div className="flex flex-col gap-2">
        <OdsButton
          label={t('tunnel:agent_download')}
          isDisabled={!isDownloadEnabled}
          onClick={() => activeDownloadUrl && triggerDownload(activeDownloadUrl)}
        />
        {!!selectedOs && !isPending && !activeDownloadUrl && !isError && (
          <OdsText preset="caption">{t('tunnel:agent_url_unavailable')}</OdsText>
        )}
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-4" aria-label={t('tunnel:agent_panel_title')}>
      <OdsText preset="heading-5">{t('tunnel:agent_panel_title')}</OdsText>
      <OdsText preset="paragraph">{t('tunnel:agent_panel_description')}</OdsText>

      <OdsFormField>
        <label htmlFor={selectOsId}>{t('tunnel:agent_select_os')}</label>
        <OdsSelect
          id={selectOsId}
          name="tunnel-os"
          value={selectedOs}
          placeholder={t('tunnel:agent_select_os_placeholder')}
          onOdsChange={(event) => setSelectedOs((event.detail.value as TunnelOs) ?? '')}
        >
          {OS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>

      <OdsTabs>
        <OdsTab isSelected={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')}>
          {t('tunnel:agent_tab_terminal')}
        </OdsTab>
        <OdsTab isSelected={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
          {t('tunnel:agent_tab_manual')}
        </OdsTab>
      </OdsTabs>

      {isError ? (
        <OdsMessage color="critical" isDismissible={false} className="w-full">
          <div className="flex w-full items-center justify-between gap-4">
            <span>{t('tunnel:agent_error')}</span>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('tunnel:retry')}
              onClick={() => refetch()}
            />
          </div>
        </OdsMessage>
      ) : (
        <div>{activeTab === 'terminal' ? renderTerminalTab() : renderManualTab()}</div>
      )}

      <section
        className="flex items-center gap-2 rounded-md p-3 mt-4"
        style={{ backgroundColor: 'var(--ods-color-information-100)' }}
      >
        <OdsIcon name={ODS_ICON_NAME.circleInfo} />
        <Links
          href={tunnelLinks.installGuide}
          target="_blank"
          type={LinkType.external}
          label={t('tunnel:agent_install_guide')}
        />
      </section>

      <div id={copyFeedbackId} className="sr-only" aria-live="polite" role="status">
        {copyAnnouncement}
      </div>
    </section>
  );
};

export default AgentInstallationPanel;
