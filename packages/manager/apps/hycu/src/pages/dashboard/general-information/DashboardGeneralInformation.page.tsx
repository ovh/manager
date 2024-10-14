import React from 'react';
import { useParams } from 'react-router-dom';
import BillingInformationsTile from './BillingInformations/BillingInformationsTile';
import GeneralInformationsTile from './GeneralInformationsTiles/GeneralInformationsTile';
import ShortcutsTile from './ShortcutsTile/ShortcutsTile';

function GeneralInfos() {
  const { serviceName } = useParams();

  return (
    <div className="flex flex-col md:flex-row gap-8 px-10 mt-10">
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
  );
}

export default GeneralInfos;
