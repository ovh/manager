import React from 'react';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ErrorPage } from '@/components/Error';
import { useUpdateVrackServices, useVrackService } from '@/utils/vs-utils';
import { formatDateString } from '@/utils/date';
import {
  ProductStatusCell,
  VrackIdCell,
  DisplayNameCell,
} from '@/components/VrackServicesDataGridCells';
import { TileBlock } from '@/components/TileBlock';
import { urls } from '@/router/constants';
import {
  PageLocation,
  PageName,
  PageType,
  TrackingClickParams,
  getClickProps,
} from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  pageType: PageType.dashboard,
  pageName: PageName.overview,
  location: PageLocation.tile,
};

export default function OverviewTab() {
  const { t, i18n } = useTranslation('vrack-services/dashboard');
  const { t: tListing } = useTranslation('vrack-services/listing');
  const [vrackUrl, setVrackUrl] = React.useState('#');
  const {
    shell: {
      tracking: { trackPage, trackClick },
      navigation: { getURL },
    },
  } = React.useContext(ShellContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vrackServices, error, isLoading } = useVrackService();
  const {
    updateVS,
    isErrorVisible,
    hideError,
    isPending,
    updateError,
  } = useUpdateVrackServices({ key: id });

  React.useEffect(() => {
    getURL(
      'dedicated',
      `#/vrack/${vrackServices?.currentState?.vrackId}`,
      {},
    ).then(setVrackUrl);
  }, [vrackServices?.currentState?.vrackId]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      {isErrorVisible && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tListing('updateError', {
              error: updateError?.response.data.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
        <div className="p-3">
          {isLoading ? (
            <OsdsTile className="w-full h-full justify-center" inline rounded>
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            </OsdsTile>
          ) : (
            <OsdsTile className="w-full h-full flex-col" inline rounded>
              <div className="flex flex-col w-full">
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('tileTitle')}
                </OsdsText>
                <OsdsDivider separator />
                <TileBlock label={t('displayName')}>
                  <DisplayNameCell
                    updateVS={updateVS}
                    cellData={vrackServices?.currentState?.displayName}
                    rowData={vrackServices}
                    trackPage={trackPage}
                  />
                </TileBlock>
                <TileBlock label={t('productStatus')}>
                  <ProductStatusCell
                    cellData={vrackServices?.currentState?.productStatus}
                    rowData={vrackServices}
                    t={t}
                  />
                </TileBlock>
                <TileBlock label={t('region')}>
                  {t(vrackServices?.currentState?.region)}
                </TileBlock>
                <TileBlock label={t('vrackId')}>
                  <VrackIdCell
                    label={t('associateVrackModal')}
                    openAssociationModal={(vsId) => {
                      trackClick(
                        getClickProps({
                          ...sharedTrackingParams,
                          actionType: 'navigation',
                          actions: ['associate_vrack-services'],
                        }),
                      );
                      navigate(urls.overviewAssociate.replace(':id', vsId));
                    }}
                    cellData={vrackServices?.currentState?.vrackId}
                    isLoading={isPending}
                    rowData={vrackServices}
                    href={vrackUrl}
                    openDissociationModal={(vsId, vrackId) => {
                      trackClick(
                        getClickProps({
                          ...sharedTrackingParams,
                          actionType: 'navigation',
                          actions: ['dissociate_vrack-services'],
                        }),
                      );
                      navigate(
                        urls.overviewDissociate
                          .replace(':id', vsId)
                          .replace(':vrackId', vrackId),
                      );
                    }}
                    t={t}
                  />
                </TileBlock>
                <TileBlock label={t('createdAt')}>
                  {formatDateString(
                    vrackServices?.createdAt,
                    i18n.language.replace('_', '-'),
                  )}
                </TileBlock>
              </div>
            </OsdsTile>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
