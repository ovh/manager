import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, Outlet, useSearchParams } from 'react-router-dom';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { IpDatagrid } from './components';
import { IpFilter, QuickFilter, FilterService } from './components/filters';
import { ListingContextProvider } from '../listingContext';
import { TRANSLATION_NAMESPACES } from '@/utils';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function IpListingPage() {
  const queryClient = useQueryClient();
  const { environment } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  const { trackClick } = useOvhTracking();

  return (
    <ListingContextProvider>
      <div className="flex flex-col">
        <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
          {t('listingTabIpDescription')}
        </OdsText>
      </div>
      <div className="flex mb-4 gap-2">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['order_ip'],
            });
            navigate(urls.order);
          }}
          label={t('orderIpsButtonLabel')}
        />
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['bring-your-own_ip'],
            });
            navigate(urls.byoip);
          }}
          label={t('orderByoipButtonLabel')}
        />
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col flex-1 mr-2 md:mr-8 md:flex-row gap-2">
          <IpFilter className="min-w-[200px] max-w-[400px] flex-1" />
          <FilterService className="min-w-[200px] max-w-[400px] flex-1" />
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            icon={ODS_ICON_NAME.refresh}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['refresh_ip'],
              });
              queryClient.invalidateQueries();
            }}
            label=""
          />
        </div>

        <div className="flex flex-col items-end ml-auto gap-2">
          <div className="flex items-end ml-auto gap-2">
            <ActionMenu
              id="settings"
              icon={ODS_ICON_NAME.cog}
              isCompact
              items={[
                {
                  id: 0,
                  label: t('listingSettingsImportIpFromSys'),
                  isDisabled: environment.user.ovhSubsidiary === 'US',
                  onClick: () => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['import_sys-ip'],
                    });
                    navigate(
                      `${urls.listingImportIpFromSys}?${search.toString()}`,
                    );
                  },
                },
              ]}
            />
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              icon={ODS_ICON_NAME.download}
              size={ODS_BUTTON_SIZE.sm}
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['download_export_ip'],
                });
                navigate(`${urls.listingExportIpToCsv}?${search.toString()}`);
              }}
              label=""
            />
          </div>
          <QuickFilter />
        </div>
      </div>

      <div className="mt-4">
        <React.Suspense fallback={<Loading />}>
          <IpDatagrid />
        </React.Suspense>
      </div>
      <Outlet />
    </ListingContextProvider>
  );
}
