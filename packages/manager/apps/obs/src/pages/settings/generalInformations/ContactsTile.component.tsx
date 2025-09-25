import {
  DashboardTile,
  Links,
  useServiceDetails,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsSkeleton } from '@ovhcloud/ods-components/react';

interface ContactsTileProps {
  serviceId: string;
}
const ContactsTile = ({
  serviceId,
}: Readonly<ContactsTileProps>): JSX.Element => {
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceId,
  });

  const items = [
    {
      id: 'contacts',
      value: (
        <div className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <OdsSkeleton key={index} />
              ))
            : serviceDetails?.data.customer.contacts.map((contact) => (
                <OdsText key={contact.type}>
                  {`${contact.customerCode} ${contact.type}`}
                </OdsText>
              ))}

          <Links
            className="part-link:py-2"
            label="Gérer les contacts"
            type={LinkType.external}
          />
        </div>
      ),
    },
  ];

  return <DashboardTile title="Contacts" items={items} />;
};

export default ContactsTile;
