import React from 'react';
import { useParams } from 'react-router-dom';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import BannerStatus from '@/domain/components/BannerStatus/BannerStatus';
import GeneralInformationsCards from '@/domain/components/InformationsCards/GeneralInformations';
import SubscriptionCards from '@/domain/components/SubscriptionCards/SubscriptionCards';

export default function GeneralInformations() {
  const { serviceName } = useParams<{ serviceName: string }>();

  return (
    <div>
      <BannerStatus serviceName={serviceName} />
      <div className="grid grid-cols-3 grid-rows-4 gap-6">
        <div className="row-span-2">
          <GeneralInformationsCards serviceName={serviceName} />
        </div>

        <div className="row-span-2 col-start-1 row-start-3">
          <ManagerTile>
            <ManagerTile.Title>Service Associé</ManagerTile.Title>
          </ManagerTile>
        </div>
        <div className="row-span-4 col-start-2 row-start-1">
          <ManagerTile>
            <ManagerTile.Title>Configuration</ManagerTile.Title>
          </ManagerTile>
        </div>
        <div className="row-span-4 col-start-3 row-start-1">
          <SubscriptionCards serviceName={serviceName} />
        </div>
      </div>
    </div>
  );
}
