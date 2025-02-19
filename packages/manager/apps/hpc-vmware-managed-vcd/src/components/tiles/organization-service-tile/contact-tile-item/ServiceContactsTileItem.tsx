import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useServiceDetails } from '@ovh-ux/manager-react-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

export default function ServiceContactsTileItem() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });
  const contactList = serviceDetails?.data?.customer?.contacts;

  if (isLoading) {
    return (
      <>
        <OdsSkeleton />
        <OdsSkeleton />
        <OdsSkeleton />
      </>
    );
  }

  if (isError || !contactList?.length) {
    return <OdsText>-</OdsText>;
  }

  return (
    <div className="flex flex-col">
      {contactList.map((contact) => (
        <OdsText key={contact.type}>
          {t(`managed_vcd_dashboard_contact_list_${contact.type}`, {
            code: contact.customerCode,
          })}
        </OdsText>
      ))}
    </div>
  );
}
