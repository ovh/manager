import { useId, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { DownloadCode } from '@/components/DownloadCode/DownloadCode.component';
import { agentsQueries } from '@/data/queries/agents.queries';
import { OS_LABELS } from '@/module.constants';
import { OS } from '@/types/Os.type';

export default function DownloadAgentPage() {
  const selectOsId = useId();
  const [osSelected, setOsSelected] = useState<OS | null>(null);
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.AGENT, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { trackClick } = useOvhTracking();
  const closeModal = () => navigate('..');

  const { data: downloadLink, isPending: isLoading } = useQuery({
    ...agentsQueries.withClient(queryClient).downloadLink(),
    enabled: !!osSelected,
    select: (data) => {
      switch (osSelected) {
        case 'WINDOWS':
          return data.windowsUrl;
        case 'LINUX':
        default:
          return data.linuxUrl;
      }
    },
  });

  const handleChangeDownloadLink = (osKey: OS) => {
    setOsSelected(osKey);
  };

  const isDownloadEnabled = !!downloadLink && !!osSelected;

  return (
    <Modal
      isOpen
      heading={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:download_agent`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:close`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.information}
    >
      <section className="flex flex-col gap-8">
        <OdsFormField>
          <label htmlFor={selectOsId}>{t(`${BACKUP_AGENT_NAMESPACES.AGENT}:select_os`)}</label>
          <OdsSelect
            id={selectOsId}
            name="os"
            value={osSelected}
            onOdsChange={(e) => handleChangeDownloadLink(e.target.value as OS)}
            placeholder={t(`${NAMESPACES.ACTIONS}:select`)}
          >
            {Object.keys(OS_LABELS).map((osKey) => (
              <option key={osKey} value={osKey}>
                {OS_LABELS[osKey as OS]}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
        <div className="flex flex-col gap-4">
          <OdsText>{t(`${BACKUP_AGENT_NAMESPACES.AGENT}:download_agent_with_executable`)}</OdsText>
          <div className="flex justify-center align-center">
            <a
              href={isDownloadEnabled ? downloadLink : undefined}
              download
              onClick={() =>
                trackClick({
                  location: PageLocation.popup,
                  buttonType: ButtonType.link,
                  actionType: 'action',
                  actions: ['download-agent-executable'],
                })
              }
            >
              <OdsButton
                label={t(`${NAMESPACES.ACTIONS}:download`)}
                isLoading={isLoading}
                isDisabled={!isDownloadEnabled}
              />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <OdsText>
            {t(`${BACKUP_AGENT_NAMESPACES.AGENT}:download_agent_with_command_line`)}
          </OdsText>
          {isLoading && downloadLink ? (
            <OdsSpinner />
          ) : (
            <DownloadCode
              className="break-all"
              osCompatibility={osSelected || 'LINUX'}
              downloadLink={isDownloadEnabled ? downloadLink : '...'}
              canCopy={isDownloadEnabled}
            />
          )}
        </div>
      </section>
    </Modal>
  );
}
