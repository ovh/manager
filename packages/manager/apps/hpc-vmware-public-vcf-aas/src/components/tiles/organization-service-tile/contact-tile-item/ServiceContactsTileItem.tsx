import React from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { ApiResponse } from '@ovh-ux/manager-core-api';
import { CustomerContact } from '@ovh-ux/manager-module-common-api';
import { ServiceDetails, useServiceDetails } from '@ovh-ux/manager-react-components';

export default function ServiceContactsTileItem() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const {
    data: serviceDetails,
    isLoading,
    isError,
  } = useServiceDetails({ resourceName: id }) as {
    data?: ApiResponse<ServiceDetails>;
    isLoading: boolean;
    isError: boolean;
  };
  const contactList: CustomerContact[] = serviceDetails?.data?.customer?.contacts;

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
