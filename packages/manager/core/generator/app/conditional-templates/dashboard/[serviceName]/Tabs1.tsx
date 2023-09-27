import React, { lazy } from 'react';
import { MscBillingTile } from '@ovhcloud/msc-react-billing-tile';
import { useParams, } from 'react-router-dom';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { Locale } from '@ovhcloud/msc-utils';

function Tabs1() {
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;
  const { serviceName } = useParams();

  return (
    <div className="dashboard-section pt-4">
      <div>
        <MscBillingTile
          servicePath={`{{this.apiPath}}/${serviceName}`}
          locale={locale}
        />
      </div>
    </div>
  );
}

export default Tabs1;
