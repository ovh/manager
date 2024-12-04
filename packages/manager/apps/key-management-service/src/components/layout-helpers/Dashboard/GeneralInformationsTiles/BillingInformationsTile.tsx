import {
  ActionMenu,
  ActionMenuItem,
  ServiceDetails,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { Outlet, useNavigate } from 'react-router-dom';
import { OsdsChip, OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OkmsServiceState } from '../okmsServiceState/OkmsServiceState.component';
import { Tile } from '@/components/dashboard/tile/tile.component';
import { TileItem } from '@/components/dashboard/tile-item/tileItem.component';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { TileSeparator } from '@/components/dashboard/tile-separator/tileSeparator';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import { DISPLAY_CONTACTS_MANAGEMENT_KEY } from './BillingInformationsTile.constants';
import { ROUTES_URLS } from '@/routes/routes.constants';

type BillingInformationsTileProps = {
  okmsService?: ServiceDetails;
};

const BillingInformationsTile = ({
  okmsService,
}: BillingInformationsTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const [contactUrl, setContactUrl] = useState('');
  const { data: availability } = useFeatureAvailability([
    DISPLAY_CONTACTS_MANAGEMENT_KEY,
  ]);
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const dateFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_dashboard_action_billing_terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: () => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['delete_kms'],
        });
        navigate(ROUTES_URLS.terminateOkms);
      },
    },
  ];

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await navigation.getURL(
          'dedicated',
          '#/contacts/services',
          {},
        );
        setContactUrl(response as string);
      } catch (error) {
        setContactUrl('#');
      }
    };
    fetchUrl();
  }, [navigation]);

  return (
    <>
      <Tile title={t('billing_informations')}>
        <TileSeparator />
        <TileItem
          title={t(
            'key_management_service_dashboard_field_label_creation_date',
          )}
        >
          <TileValueDate
            value={okmsService?.billing.lifecycle.current.creationDate}
            options={dateFormat}
          />
        </TileItem>
        <TileSeparator />
        <TileItem
          title={t('key_management_service_dashboard_field_label_state')}
        >
          <span>
            <OkmsServiceState state={okmsService?.resource.state} inline />
          </span>
        </TileItem>
        <TileSeparator />
        <TileItem
          title={t(
            'key_management_service_dashboard_field_label_next_billing_date',
          )}
        >
          <div className="flex flex-row justify-between items-center">
            <TileValueDate
              value={okmsService?.billing.nextBillingDate}
              options={dateFormat}
            />

            <div className="flex flex-row align-center gap-4">
              <ActionMenu
                items={items}
                isCompact
                icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
              />
            </div>
          </div>
        </TileItem>
        <TileSeparator />
        <TileItem
          title={t('key_management_service_dashboard_field_label_engagement')}
        >
          <span>
            <OsdsChip color={ODS_TEXT_COLOR_INTENT.error} inline>
              {okmsService?.billing.engagement?.endRule?.strategy
                ? okmsService.billing.engagement.endRule.strategy
                : t(
                    'key_management_service_dashboard_field_label_engagement_none',
                  )}
            </OsdsChip>
          </span>
        </TileItem>
        {availability?.[DISPLAY_CONTACTS_MANAGEMENT_KEY] && (
          <>
            <TileSeparator />
            <TileItem
              title={t('key_management_service_dashboard_field_label_contacts')}
            >
              {okmsService?.customer.contacts.map((contact) => {
                return (
                  <TileValue
                    key={contact.customerCode + contact.type}
                    value={`${contact.customerCode} ${t(
                      `key_management_service_dashboard_contact_type_${contact.type}`,
                    )}`}
                  />
                );
              })}
              <div className="flex flex-row items-center">
                <OsdsLink
                  href={contactUrl}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() =>
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.externalLink,
                      actionType: 'navigation',
                      actions: ['contact_support'],
                    })
                  }
                >
                  {t(
                    'key_management_service_dashboard_field_label_manage_contacts',
                  )}
                </OsdsLink>
                <OsdsIcon
                  className="pl-4"
                  name={ODS_ICON_NAME.ARROW_RIGHT}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.info}
                ></OsdsIcon>
              </div>
            </TileItem>
          </>
        )}
      </Tile>
      <Outlet />
    </>
  );
};

export default BillingInformationsTile;
