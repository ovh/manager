import { h, Fragment } from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';

export const ContactContent = (
  serviceName: string,
  serviceType: string,
  localStrings: { [key: string]: string },
  contactAdmin: string,
  contactBilling: string,
  contactTech: string,
  contactProperty: string,
  whoisOwnerDomain: string,
  dataTracking?: string,
) => {
  const getMenuLink = () => {
    return (
      <div class="tooltiplinks">
        <osds-link
          data-tracking={dataTracking}
          href={`https://www.ovh.com/manager/#/dedicated/contacts/services?serviceName=${serviceName}`}
          color={OdsThemeColorIntent.primary}
        >
          {localStrings.manager_billing_subscription_contacts_management}
        </osds-link>
        {serviceType === 'DOMAIN' ? (
          <>
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'${serviceName})`}
              target="blank"
              color={OdsThemeColorIntent.primary}
            >
              {localStrings.billing_services_actions_menu_change_owner}
              <osds-icon
                class="link-icon"
                size={OdsIconSize.xxs}
                name={OdsIconName.EXTERNAL_LINK}
                color={OdsThemeColorIntent.primary}
              />
            </osds-link>
            <osds-link
              data-tracking={dataTracking}
              href={`https://www.ovh.com/manager/#/dedicated/contact/${serviceName}/${whoisOwnerDomain}`}
              color={OdsThemeColorIntent.primary}
            >
              {
                localStrings.billing_services_actions_menu_configuration_update_owner
              }
            </osds-link>
          </>
        ) : (
          <osds-link
            data-tracking={dataTracking}
            href={`https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi`}
            target="blank"
            color={OdsThemeColorIntent.primary}
          >
            {localStrings.billing_services_actions_menu_change_owner}
            <osds-icon
              class="link-icon"
              size={OdsIconSize.xxs}
              name={OdsIconName.EXTERNAL_LINK}
              color={OdsThemeColorIntent.primary}
            />
          </osds-link>
        )}
      </div>
    );
  };

  return (
    <>
      <menu-custom>{getMenuLink()}</menu-custom>
      <osds-text
        class="tile-description"
        level={OdsThemeTypographyLevel.body}
        size={OdsThemeTypographySize._200}
        color={OdsThemeColorIntent.default}
      >
        <div>
          {contactAdmin}{' '}
          {localStrings.manager_billing_subscription_contacts_admin}
        </div>
        <div>
          {contactTech}{' '}
          {localStrings.manager_billing_subscription_contacts_tech}
        </div>
        <div>
          {contactBilling}{' '}
          {localStrings.manager_billing_subscription_contacts_billing}
        </div>
        {contactProperty && (
          <div>
            {contactProperty}{' '}
            {localStrings.billing_services_domain_contact_owner}
          </div>
        )}
      </osds-text>
    </>
  );
};

export default ContactContent;
