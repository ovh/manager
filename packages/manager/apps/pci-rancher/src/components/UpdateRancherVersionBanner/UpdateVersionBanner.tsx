import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useHref } from 'react-router-dom';
import { useTranslate } from '@/utils/translation';
import {
  getCurrentVersionInfo,
  getLatestVersionAvailable,
  isVersionDeprecated,
} from '@/utils/rancher';
import { RancherService, RancherVersion, ResourceStatus } from '@/api/api.type';
import LinkIcon from '../LinkIcon/LinkIcon';

const SimpleBannerWithCta = ({
  text,
  cta,
  href,
  bannerType = ODS_MESSAGE_TYPE.warning,
}: {
  text: string;
  cta?: string;
  href?: string;
  bannerType: ODS_MESSAGE_TYPE;
}) => {
  return (
    <OsdsMessage
      type={bannerType}
      color={(bannerType as unknown) as ODS_THEME_COLOR_INTENT}
      className="my-4 p-3"
    >
      <div className="flex flex-row items-center">
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
          className="inline-block mr-5"
        >
          {text}
        </OsdsText>
        {cta && href && (
          <LinkIcon
            iconName={ODS_ICON_NAME.ARROW_RIGHT}
            href={href}
            text={cta}
          />
        )}
      </div>
    </OsdsMessage>
  );
};

const UpdateVersionBanner = ({
  rancher,
  isPendingUpdateOperation,
  versions,
}: {
  rancher: RancherService;
  isPendingUpdateOperation: boolean;
  versions: RancherVersion[];
}) => {
  const latestVersionAvailable = getLatestVersionAvailable(rancher, versions);
  const currentVersionInfo = getCurrentVersionInfo(rancher, versions);
  const isVersionDeprecied =
    currentVersionInfo && isVersionDeprecated(currentVersionInfo);

  const { t } = useTranslate('pci-rancher/updateSoftware');
  const hrefUpdateSoftware = useHref('./update-software');

  const shouldDisplayUpdateSoftware =
    latestVersionAvailable &&
    rancher.resourceStatus === ResourceStatus.READY &&
    !isPendingUpdateOperation;

  if (isVersionDeprecied) {
    return (
      <SimpleBannerWithCta
        bannerType={ODS_MESSAGE_TYPE.warning}
        text={t('updateSoftwareBannerDeprecated')}
        cta={t('updateSoftwareAvailableUpdate')}
        href={hrefUpdateSoftware}
      />
    );
  }

  if (isPendingUpdateOperation) {
    return (
      <SimpleBannerWithCta
        bannerType={ODS_MESSAGE_TYPE.warning}
        text={t('updateSoftwareBannerUpdateLoading')}
      />
    );
  }

  return (
    <>
      {shouldDisplayUpdateSoftware && (
        <SimpleBannerWithCta
          bannerType={ODS_MESSAGE_TYPE.info}
          text={t('updateSoftwareBannerAvailableUpdate')}
          cta={t('updateSoftwareAvailableUpdate')}
          href={hrefUpdateSoftware}
        />
      )}
    </>
  );
};

export default UpdateVersionBanner;
