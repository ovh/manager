import {
  DashboardTile,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { BACKUP_SAP_TITLE } from './general-informations.constants';

function GeneralInfos() {
  const { t } = useTranslation('dashboard');
  const guides = useGuideUtils();
  const wizardHref = useHref(urls.installationWizardStep);
  const listingHref = useHref(urls.installation);

  const Tiles = [
    {
      title: t('blocks_pre_installation_sap_hana_title'),
      items: [
        {
          id: 'description',
          value: (
            <OdsText>
              {t('blocks_pre_installation_sap_hana_description')}
            </OdsText>
          ),
        },
        {
          id: 'link-documentation',
          value: (
            <Links
              label={t('blocks_documentation')}
              href={guides.pre_installation_sap}
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
      ],
    },
    {
      title: t('blocks_infrastructure_as_code_title'),
      items: [
        {
          id: 'description',
          value: (
            <OdsText>{t('blocks_infrastructure_as_code_description')}</OdsText>
          ),
        },
        {
          id: 'link-documentation',
          value: (
            <Links
              label={t('blocks_documentation')}
              href={guides.infrastructure_as_code}
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
        {
          id: 'link-source-code',
          value: (
            <Links
              label={t('blocks_code_source')}
              href="https://github.com/ovh/terraform-vsphere-sap-system/tree/master"
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
      ],
    },
    {
      title: BACKUP_SAP_TITLE,
      items: [
        {
          id: 'description',
          value: <OdsText>{t('blocks_backup_sap_hana_description')}</OdsText>,
        },
        {
          id: 'link-download',
          value: (
            <Links
              label={t('blocks_download')}
              href="https://ovhcloud-backint-agent.s3.rbx.io.cloud.ovh.net/ovhcloud-backint-agent.zip"
            />
          ),
        },
        {
          id: 'link-documentation',
          value: (
            <Links
              label={t('blocks_documentation')}
              href={guides.backup_sap_hana}
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
      ],
    },
    {
      title: t('blocks_pre_installation_wizard_sap_title'),
      items: [
        {
          id: 'description',
          value: (
            <OdsText>
              {t('blocks_pre_installation_wizard_sap_description')}
            </OdsText>
          ),
        },
        {
          id: 'start-wizard',
          value: (
            <Links
              label={t('blocks_start_wizard')}
              href={wizardHref}
              type={LinkType.next}
            />
          ),
        },
        {
          id: 'pre-install-list',
          value: (
            <Links
              label={t('blocks_pre_install_list')}
              href={listingHref}
              type={LinkType.next}
            />
          ),
        },
        {
          id: 'link-documentation',
          value: (
            <Links
              label={t('blocks_documentation')}
              href={guides.pre_installation_wizard}
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
      ],
    },
    {
      title: t('blocks_logs_analysis_and_extract_title'),
      items: [
        {
          id: 'description',
          value: (
            <OdsText>
              {t('blocks_logs_analysis_and_extract_description')}
            </OdsText>
          ),
        },
        {
          id: 'link-documentation',
          value: (
            <Links
              label={t('blocks_documentation')}
              href={t('logs_analysis_and_extract')}
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
        {
          id: 'link-source-code',
          value: (
            <Links
              label={t('blocks_code_source')}
              href="https://github.com/ovh/terraform-vsphere-sap-system/tree/master"
              target="_blank"
              type={LinkType.external}
            />
          ),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Tiles.map((tile) => (
          <DashboardTile
            title={t(tile.title)}
            items={tile.items}
            key={tile.title}
          />
        ))}
      </div>
      <OdsText>{t('blocks_explanations')}</OdsText>
    </div>
  );
}

export default GeneralInfos;
