import React from 'react';

import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  TEXT_PRESET,
  Button,
  Text,
} from '@ovhcloud/ods-react';

import { ActionMenu } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { ListingContextProvider } from '../listingContext';
import { IpDatagrid } from './components';
import { FilterService, IpFilter, QuickFilter } from './components/filters';

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
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('listingTabIpDescription')}
        </Text>
      </div>
      <div className="mb-4 flex gap-4">
        <Button
          variant={BUTTON_VARIANT.outline}
          size={BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['order_ip'],
            });
            navigate(urls.order);
          }}
        >
          <Icon name={ICON_NAME.plus} className="mr-2" />
          {t('orderIpsButtonLabel')}
        </Button>
        <Button
          variant={BUTTON_VARIANT.outline}
          size={BUTTON_SIZE.sm}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['bring-your-own_ip'],
            });
            navigate(urls.byoip);
          }}
        >
          <Icon name={ICON_NAME.plus} className="mr-2" />
          {t('orderByoipButtonLabel')}
        </Button>
      </div>

      <div className="flex flex-row">
        <div className="mr-2 flex flex-1 flex-col gap-3 md:mr-8 md:flex-row md:items-start">
          <IpFilter className="min-w-[200px] max-w-[400px] flex-1" />
          <FilterService className="min-w-[200px] max-w-[400px] flex-1" />
          <Button
            className="max-w-[40px]"
            variant={BUTTON_VARIANT.outline}
            size={BUTTON_SIZE.sm}
            onClick={() => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['refresh_ip'],
              });
              queryClient.invalidateQueries();
            }}
          >
            <Icon name={ICON_NAME.refresh} />
          </Button>
        </div>

        <div className="ml-auto flex flex-col items-end gap-3">
          <div className="ml-auto flex items-end gap-3">
            <ActionMenu
              id="settings"
              icon={ICON_NAME.cog}
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
            <Button
              variant={BUTTON_VARIANT.outline}
              size={BUTTON_SIZE.sm}
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['download_export_ip'],
                });
                navigate(`${urls.listingExportIpToCsv}?${search.toString()}`);
              }}
            >
              <Icon name={ICON_NAME.download} />
            </Button>
          </div>
          <QuickFilter />
        </div>
      </div>

      <div className="mt-3">
        <React.Suspense fallback={<Loading />}>
          <IpDatagrid />
        </React.Suspense>
      </div>
      <Outlet />
    </ListingContextProvider>
  );
}
