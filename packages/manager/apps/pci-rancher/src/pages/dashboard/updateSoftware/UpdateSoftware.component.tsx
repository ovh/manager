import { DashboardLayout, Subtitle, Title } from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TABLE_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsRadioButton,
  OsdsTable,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { FC, useEffect, useState } from 'react';
import { useHref, useParams } from 'react-router-dom';
import { RancherService, RancherVersion } from '@/api/api.type';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import LinkIcon from '@/components/LinkIcon/LinkIcon';
import UpdateSoftwareModal from '@/components/Modal/UpdateSoftwareConfirmModal';
import { getLatestVersions } from '@/utils/rancher';
import { getRancherByIdUrl } from '@/utils/route';

interface VersionTableProps {
  versions: RancherVersion[];
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  currentVersion: RancherVersion;
}

const VersionTable = ({
  selectedVersion,
  versions,
  setSelectedVersion,
  currentVersion,
}: VersionTableProps) => {
  const { t } = useTranslation([
    'pci-rancher/updateSoftware',
    'pci-rancher/dashboard',
  ]);
  return (
    <OsdsTable className="my-6" size={ODS_TABLE_SIZE.sm}>
      <table>
        <thead>
          <tr>
            <th>{t('updateSoftwareRancherTableVersion')}</th>
          </tr>
        </thead>
        <tbody>
          {[currentVersion, ...versions].map((version) => (
            <tr className="my-5" key={version.name}>
              <th className="flex items-center justify-between">
                <OsdsRadioButton
                  checked={selectedVersion === version.name || null}
                  disabled={
                    currentVersion.name === version.name ||
                    version.status === 'UNAVAILABLE' ||
                    null
                  }
                  onClick={() => {
                    if (
                      currentVersion.name !== version.name &&
                      version.status !== 'UNAVAILABLE'
                    ) {
                      setSelectedVersion(version.name);
                    }
                  }}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_RADIO_BUTTON_SIZE.xs as any}
                >
                  <span slot="end" className="flex items-center gap-2">
                    <OsdsText>
                      Version {version.name}
                      {currentVersion.name === version.name &&
                        ` (${t('updateSoftwareRancherCurrentVersion')})`}
                    </OsdsText>
                    {version.status === 'UNAVAILABLE' &&
                      currentVersion.name !== version.name && (
                        <OsdsChip className="ml-2">
                          {t('updateSoftwareRancherTableUnavailable')}
                        </OsdsChip>
                      )}
                  </span>
                </OsdsRadioButton>
                {currentVersion.name !== version.name &&
                  version.changelogUrl && (
                    <LinkIcon
                      iconName={ODS_ICON_NAME.EXTERNAL_LINK}
                      href={version.changelogUrl}
                      target={OdsHTMLAnchorElementTarget._blank}
                      text={t('updateSoftwareRancherChangelog')}
                    />
                  )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </OsdsTable>
  );
};

export type UpdateSoftwareProps = {
  rancher: RancherService;
  versions: RancherVersion[];
  onClickUpdate: (version: string) => void;
  isUpdatePending: boolean;
  currentVersionDetails: RancherVersion;
};

const UpdateSoftware: FC<UpdateSoftwareProps> = ({
  rancher,
  versions,
  onClickUpdate,
  isUpdatePending,
  currentVersionDetails,
}) => {
  const { projectId } = useParams();

  const { t } = useTranslation('pci-rancher/updateSoftware');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hrefRancherById = useHref(getRancherByIdUrl(projectId, rancher?.id));
  const [selectedVersion, setSelectedVersion] = useState('');

  const availableVersions = getLatestVersions(rancher, versions);

  useEffect(() => {
    if (versions?.length > 0) {
      setSelectedVersion(versions[versions.length - 1].name);
    }
  }, [versions]);

  const content = (
    <div className="max-w-3xl">
      <div className="overflow-hidden text-ellipsis">
        <Title>{rancher.currentState.name}</Title>
      </div>
      <LinkIcon
        href={hrefRancherById}
        text={t('updateSoftwareRancherPreviousButton')}
        iconName={ODS_ICON_NAME.ARROW_LEFT}
        slot="start"
        className="my-6"
      />
      <Subtitle>{t('updateSoftwareRancherTitle')}</Subtitle>
      <div className="mt-5">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('updateSoftwareRancherDescription')}
        </OsdsText>
      </div>
      {currentVersionDetails && versions?.length > 0 && (
        <VersionTable
          versions={availableVersions}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          currentVersion={currentVersionDetails}
        />
      )}
      <div>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('updateSoftwareRancherDurationInfo')}
        </OsdsText>
      </div>
      <div className="mt-5">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('updateSoftwareRancherImpact')}
        </OsdsText>
      </div>
      <div className="mt-5">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('updateSoftwareRancherUpgradeInfo')}
        </OsdsText>
      </div>
      <div className="my-6">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => setShowConfirmModal(true)}
          inline
        >
          {t('updateSoftwareRancherCta')}
        </OsdsButton>
      </div>
      {showConfirmModal && (
        <UpdateSoftwareModal
          selectedVersion={selectedVersion}
          isUpdatePending={isUpdatePending}
          onConfirmUpdated={() => onClickUpdate(selectedVersion)}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );

  return (
    <DashboardLayout
      breadcrumb={
        <Breadcrumb
          items={[
            {
              label: t('updateSoftwareRancherBreadcrumb'),
            },
          ]}
        />
      }
      content={content}
    />
  );
};

export default UpdateSoftware;
