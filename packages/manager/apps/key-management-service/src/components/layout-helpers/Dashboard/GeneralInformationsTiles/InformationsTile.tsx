import React, { useState } from 'react';
import {
  OsdsClipboard,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_LINK_REFERRER_POLICY,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/interface';
import EditNameModal from '@/components/Modal/EditNameModal';
import { useUpdateOkmsName } from '@/api/services';

type InformationTileProps = {
  okmsData?: OKMS;
};

const InformationsTile = ({ okmsData }: InformationTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const [editModalDisplayed, setEditModalDisplayed] = useState(false);
  const { updateKmsName } = useUpdateOkmsName({});

  return (
    <OsdsTile className="w-full h-full flex-col" inline rounded>
      {editModalDisplayed && (
        <EditNameModal
          okms={okmsData}
          toggleModal={setEditModalDisplayed}
          onEditName={(okms: OKMS) =>
            updateKmsName({ okms: okms.id, displayName: okms.iam.displayName })
          }
        />
      )}
      <div className="flex flex-col w-full">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('general_informations')}
        </OsdsText>
        <OsdsDivider separator />
        <div className="flex flex-col mb-3">
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_name')}
          </OsdsText>
          <div className="flex flex-row justify-between items-center">
            <OsdsText
              className="mb-4"
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.default}
            >
              {okmsData?.iam.displayName}
            </OsdsText>
            <OsdsIcon
              aria-label="edit"
              className="mx-6 cursor-pointer"
              onClick={() => setEditModalDisplayed(true)}
              name={ODS_ICON_NAME.PEN}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </div>
          <OsdsDivider separator />
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_id')}
          </OsdsText>
          <OsdsClipboard className="mb-2" value={okmsData?.id}></OsdsClipboard>
          <OsdsDivider separator />
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_urn')}
          </OsdsText>
          <OsdsClipboard
            className="mb-2"
            value={okmsData?.iam.urn}
          ></OsdsClipboard>
          <OsdsDivider separator />
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_region')}
          </OsdsText>
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {t(
              `key_management_service_dashboard_region_${okmsData?.region.toLowerCase()}`,
            )}
          </OsdsText>
          <OsdsDivider separator />
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_restApi')}
          </OsdsText>
          <OsdsLink
            href={okmsData?.restEndpoint}
            color={ODS_THEME_COLOR_INTENT.primary}
            target={OdsHTMLAnchorElementTarget._blank}
            referrerpolicy={
              ODS_LINK_REFERRER_POLICY.strictOriginWhenCrossOrigin
            }
          >
            {okmsData?.restEndpoint}
          </OsdsLink>
          <OsdsDivider separator />
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('key_management_service_dashboard_field_label_kmip')}
          </OsdsText>
          <OsdsClipboard
            className="mb-2"
            value={okmsData?.kmipEndpoint}
          ></OsdsClipboard>
        </div>
      </div>
    </OsdsTile>
  );
};

export default InformationsTile;
