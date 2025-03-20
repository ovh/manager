import React from 'react';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useGetOrganisationsDetails } from '@/data/hooks/organisation';

type OrganisationsCellProps = {
  org: string;
};

export const OrganisationsAddressCell = ({ org }: OrganisationsCellProps) => {
  const { orgDetails, isLoading } = useGetOrganisationsDetails({ org });
  return (
    <>
      {isLoading && (
        <div className="mt-2">
          <OdsSkeleton></OdsSkeleton>
        </div>
      )}
      {!isLoading && !!orgDetails?.address && (
        <div className="mt-2 inline-block">{orgDetails?.address} </div>
      )}
    </>
  );
};
