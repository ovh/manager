import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import BillingInformationsTile from './BillingInformations/BillingInformationsTile';
import GeneralInformationsTile from './GeneralInformationsTiles/GeneralInformationsTile';
import ShortcutsTile from './ShortcutsTile/ShortcutsTile';

function GeneralInfos() {
  const { serviceName } = useParams();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 md:mt-9">
        <div className="w-full">
          <GeneralInformationsTile serviceName={serviceName} />
        </div>
        <div className="w-full">
          <ShortcutsTile serviceName={serviceName} />
        </div>
        <div className="w-full">
          <BillingInformationsTile serviceName={serviceName} />
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default GeneralInfos;
