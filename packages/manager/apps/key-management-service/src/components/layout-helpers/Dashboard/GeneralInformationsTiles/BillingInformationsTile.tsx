import React, { useContext } from 'react';
import {
  ActionMenu,
  ActionMenuItem,
  DashboardTile,
  LinkType,
  Links,
} from '@ovh-ux/manager-react-components';
import {
  useFeatureAvailability,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import {
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BADGE_COLOR,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { Outlet, useNavigate } from 'react-router-dom';
import { OdsText, OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OkmsServiceState } from '../okmsServiceState/OkmsServiceState.component';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import {
  DISPLAY_CONTACTS_MANAGEMENT_KEY,
  dateFormat,
} from './BillingInformationsTile.constants';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';

type BillingInformationsTileProps = {
  okmsService?: ServiceDetails;
};

const BillingInformationsTile = ({
  okmsService,
}: BillingInformationsTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const navigate = useNavigate();
  const [contactUrl, setContactUrl] = React.useState('#');
  const { trackClick } = useOvhTracking();
  const { data: availability } = useFeatureAvailability([
    DISPLAY_CONTACTS_MANAGEMENT_KEY,
  ]);
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  React.useEffect(() => {
    navigation
      .getURL('dedicated', '#/contacts/services', {})
      .then(setContactUrl, () => setContactUrl('#'));
  }, [navigation]);

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_dashboard_action_billing_terminate'),
      onClick: () => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['delete_kms'],
        });
        navigate(KMS_ROUTES_URIS.terminateOkms);
      },
    },
  ];

  return (
    <>
      <DashboardTile
        title={t('billing_informations')}
        items={[
          {
            id: 'creationDate',
            label: t(
              'key_management_service_dashboard_field_label_creation_date',
            ),
            value: (
              <TileValueDate
                value={okmsService?.billing.lifecycle.current.creationDate}
                options={dateFormat}
              />
            ),
          },
          {
            id: 'state',
            label: t('key_management_service_dashboard_field_label_state'),
            value: (
              <span>
                <OkmsServiceState state={okmsService?.resource?.state} />
              </span>
            ),
          },
          {
            id: 'nextBillingDate',
            label: t(
              'key_management_service_dashboard_field_label_next_billing_date',
            ),
            value: (
              <div className="flex flex-row justify-between items-center gap-2">
                <TileValueDate
                  value={okmsService?.billing.nextBillingDate}
                  options={dateFormat}
                />

                <div className="flex flex-row align-center gap-4">
                  <ActionMenu
                    id="nextBillingDateMenu"
                    items={items}
                    isCompact
                    icon={ODS_ICON_NAME.ellipsisVertical}
                    variant={ODS_BUTTON_VARIANT.ghost}
                  />
                </div>
              </div>
            ),
          },
          {
            id: 'engagement',
            label: t('key_management_service_dashboard_field_label_engagement'),
            value: (
              <span>
                <OdsBadge
                  color={ODS_BADGE_COLOR.critical}
                  label={
                    okmsService?.billing.engagement?.endRule?.strategy ??
                    t(
                      'key_management_service_dashboard_field_label_engagement_none',
                    )
                  }
                />
              </span>
            ),
          },
          availability?.[DISPLAY_CONTACTS_MANAGEMENT_KEY] && {
            id: 'contacts',
            label: t('key_management_service_dashboard_field_label_contacts'),
            value: (
              <>
                <div className="mb-3">
                  {okmsService?.customer.contacts.map((contact) => (
                    <OdsText
                      key={contact.customerCode + contact.type}
                      preset={ODS_TEXT_PRESET.span}
                      className="block mb-1"
                    >{`${contact.customerCode} ${t(
                      `key_management_service_dashboard_contact_type_${contact.type}`,
                    )}`}</OdsText>
                  ))}
                </div>
                <Links
                  type={LinkType.next}
                  href={(contactUrl as unknown) as string}
                  onClickReturn={() =>
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.externalLink,
                      actionType: 'navigation',
                      actions: ['contact_support'],
                    })
                  }
                  label={t(
                    'key_management_service_dashboard_field_label_manage_contacts',
                  )}
                />
              </>
            ),
          },
        ].filter(Boolean)}
      />
      <Outlet />
    </>
  );
};

export default BillingInformationsTile;
