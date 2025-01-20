import '../../translations';
import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '../../../../content/ManagerTile/manager-tile.component';
import { Links, LinksProps, LinkType } from '../../../../typography';
import {
  BillingInformationContext,
  useBillingInformationContextServiceDetails,
} from '../../BillingInformationsContext';

export const BillingInformationsContacts = ({
  onManageLinkClickReturn,
}: {
  onManageLinkClickReturn?: () => void;
}) => {
  return (
    <ManagerTile.Item>
      <BillingInformationsContacts.Label />
      <ManagerTile.Item.Description>
        <BillingInformationsContacts.List />
        <BillingInformationsContacts.ManageLink
          onClickReturn={onManageLinkClickReturn}
        />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};

export const BillingInformationsContactsLabel = () => {
  const { t } = useTranslation('billing-informations-tile');

  return (
    <ManagerTile.Item.Label>
      {t('billing_informations_tile_field_label_contacts')}
    </ManagerTile.Item.Label>
  );
};

export const BillingInformationsContactsList = () => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } =
    useBillingInformationContextServiceDetails();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 mb-2">
        <OdsSkeleton className="part-skeleton:max-w-xs" />
        <OdsSkeleton className="part-skeleton:max-w-xs" />
        <OdsSkeleton className="part-skeleton:max-w-xs" />
      </div>
    );
  }

  return (
    <div className="mb-3">
      {serviceDetails?.customer.contacts.map((contact) => (
        <OdsText
          key={contact.customerCode + contact.type}
          preset={ODS_TEXT_PRESET.span}
          className="block mb-1"
        >{`${contact.customerCode} ${t(
          `billing_informations_tile_contact_type_${contact.type}`,
        )}`}</OdsText>
      ))}
    </div>
  );
};

export const BillingInformationsContactsManageLink = (props: LinksProps) => {
  const { resourceName } = useContext(BillingInformationContext);
  const { t } = useTranslation('billing-informations-tile');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [contactUrl, setContactUrl] = React.useState('#');
  React.useEffect(() => {
    navigation
      .getURL('dedicated', '#/contacts/services', { searchText: resourceName })
      .then(setContactUrl, () => setContactUrl('#'));
  }, [navigation]);

  return (
    <Links
      type={LinkType.next}
      href={contactUrl as unknown as string}
      label={t('billing_informations_tile_field_label_manage_contacts')}
      {...props}
    />
  );
};

BillingInformationsContacts.Label = BillingInformationsContactsLabel;
BillingInformationsContacts.List = BillingInformationsContactsList;
BillingInformationsContacts.ManageLink = BillingInformationsContactsManageLink;
