import { h, Fragment } from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsChipSize,
  OdsChipVariant,
} from '@ovhcloud/ods-core';

export const RenewalContent = (
  serviceName: string,
  serviceType: string,
  servicePath: string,
  renewStatus: string,
  localStrings: { [key: string]: string },
  nextBillingDate: string,
  dataTracking?: string,
) => {
  const status = renewStatus;
  const getColor = () => {
    switch (status) {
      case 'deleteAtExpiration':
        return OdsThemeColorIntent.error;
      case 'automatic':
        return OdsThemeColorIntent.success;
      case 'manualPayment':
        return OdsThemeColorIntent.warning;
      case 'expired':
        return OdsThemeColorIntent.error;
      default:
        return OdsThemeColorIntent.default;
    }
  };

  const getText = () => {
    switch (status) {
      case 'deleteAtExpiration':
        return localStrings.manager_billing_service_status_delete_at_expiration;
      case 'automatic':
        return localStrings.manager_billing_service_status_automatic;
      case 'manualPayment':
        return localStrings.manager_billing_service_status_manualPayment;
      case 'expired':
        return localStrings.manager_billing_service_status_expired;
      default:
        return localStrings[`manager_billing_service_status_${status}`];
    }
  };

  const getMenuLink = () => {
    switch (status) {
      case 'expired':
        return (
          <osds-link
            data-tracking={dataTracking}
            color={OdsThemeColorIntent.primary}
            href={`https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`}
            target="blank"
          >
            {localStrings.billing_services_actions_menu_renew}
            <osds-icon
              class="link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.EXTERNAL_LINK}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
        );
      case 'deleteAtExpiration':
        return (
          <osds-link
            data-tracking={dataTracking}
            color={OdsThemeColorIntent.primary}
            href={`https://www.ovh.com/manager/dedicated/#/${servicePath}/dashboard/cancel-resiliation`}
          >
            {localStrings.billing_services_actions_menu_resiliate_cancel}
          </osds-link>
        );
      case 'manualPayment':
        return (
          <div class="tooltiplinks">
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_manage_renew}
            </osds-link>
            <osds-link
              href={`https://www.ovh.com/manager/#/dedicated/${servicePath}/commitment`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_anticipate_renew}
            </osds-link>
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_resiliate}
            </osds-link>
          </div>
        );
      default:
        // automatic and others
        return (
          <div class="tooltiplinks">
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_manage_renew}
            </osds-link>
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/${servicePath}/commitment`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_anticipate_renew}
            </osds-link>
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew/delete?serviceId=${serviceName}&serviceType=${serviceType}`}
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_resiliate}
            </osds-link>
          </div>
        );
    }
  };

  return (
    <>
      <div>
        <menu-custom>{getMenuLink()}</menu-custom>
      </div>
      <osds-text
        class="tile-description"
        level={OdsThemeTypographyLevel.body}
        size={OdsThemeTypographySize._200}
        color={OdsThemeColorIntent.default}
      >
        <div>{nextBillingDate}</div>
        <osds-chip
          color={getColor()}
          size={OdsChipSize.sm}
          variant={OdsChipVariant.flat}
        >
          {getText()}
        </osds-chip>
      </osds-text>
    </>
  );
};

export default RenewalContent;
