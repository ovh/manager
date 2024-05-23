import { DashboardLayout, Subtitle } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TABLE_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsButton,
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
import { getLatestVersionsAvailable, getVersion } from '@/utils/rancher';
import { getRancherByIdUrl } from '@/utils/route';
import { useTranslate } from '@/utils/translation';

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
  const { t } = useTranslate([
    'pci-rancher/updateSoftware',

    'pci-rancher/dashboard',
  ]);
  return (
    <OsdsTable className="my-6" size={ODS_TABLE_SIZE.sm}>
      <table>
        <thead>
          <tr>
            <th scope="col">{t('rancher_version')}</th>
          </tr>
        </thead>
        <tbody>
          {[currentVersion, ...versions].map((version) => (
            <tr className="my-5" key={version.name}>
              <th className="flex items-center justify-between">
                <OsdsRadioButton
                  checked={selectedVersion === version.name || null}
                  disabled={currentVersion.name === version.name || null}
                  onClick={() => {
                    if (currentVersion.name !== version.name) {
                      setSelectedVersion(version.name);
                    }
                  }}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_RADIO_BUTTON_SIZE.sm}
                >
                  <span slot="end">
                    <OsdsText>
                      Version {version.name}
                      {currentVersion.name === version.name &&
                        ` (${t('updateSoftwareRancherCurrentVersion')})`}
                    </OsdsText>
                  </span>
                </OsdsRadioButton>
                {currentVersion.name !== version.name && (
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
};

const UpdateSoftware: FC<UpdateSoftwareProps> = ({
  rancher,
  versions,
  onClickUpdate,
  isUpdatePending,
}) => {
  const { projectId } = useParams();

  const { t } = useTranslate('pci-rancher/updateSoftware');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const currentVersion = getVersion(rancher);

  const availableVersions = getLatestVersionsAvailable(rancher, versions);
  const currentVersionDetails = versions?.find(
    (version) => version.name === currentVersion,
  );
  const hrefRancherById = useHref(getRancherByIdUrl(projectId, rancher?.id));

  const [selectedVersion, setSelectedVersion] = useState(currentVersion);

  useEffect(() => {
    if (versions?.length > 0) {
      setSelectedVersion(versions[versions.length - 1].name);
    }
  }, [versions]);

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
      content={
        <div className="max-w-4xl">
          <div className="my-4">
            <LinkIcon
              href={hrefRancherById}
              text={t('updateSoftwareRancherPreviousButton')}
              iconName={ODS_ICON_NAME.ARROW_LEFT}
              slot="start"
            />
          </div>
          <Subtitle>{t('updateSoftwareRancherTitle')}</Subtitle>
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
          <div className="mt-6 max-w-xs">
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => setShowConfirmModal(true)}
            >
              {t('updateSoftwareRancherCta')}
            </OsdsButton>
          </div>
          {showConfirmModal && (
            <UpdateSoftwareModal
              version={versions[0]}
              isUpdatePending={isUpdatePending}
              onConfirmUpdated={() => onClickUpdate(selectedVersion)}
              onClose={() => setShowConfirmModal(false)}
            />
          )}
        </div>
      }
    />
  );
};

export default UpdateSoftware;
