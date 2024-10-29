import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Description,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

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
        <OsdsSkeleton />
        <OsdsSkeleton />
        <OsdsSkeleton />
      </>
    );
  }

  if (isError || !contactList?.length) {
    return <Description>-</Description>;
  }

  return (
    <>
      {contactList.map((contact) => (
        <Description key={contact.type}>
          {t(`managed_vcd_dashboard_contact_list_${contact.type}`, {
            code: contact.customerCode,
          })}
        </Description>
      ))}
    </>
  );
}
