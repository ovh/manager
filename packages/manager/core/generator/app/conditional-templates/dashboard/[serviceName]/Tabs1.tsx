import React from 'react';
import { MscBillingTile } from '@ovhcloud/msc-react-billing-tile';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { Locale, Subsidiary } from '@ovhcloud/msc-utils';

function Tabs1() {
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;
  const { serviceName } = useParams();

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      <div className="p-3">
        <MscBillingTile
          appPublicUrl={environment.getApplication().publicURL}
          region={environment.getRegion()}
          subsidiary={environment.getUser().ovhSubsidiary as Subsidiary}
          servicePath={`{{this.mainApiPath}}/${serviceName}`}
          locale={locale}
        />
      </div>
      <div className="p-3">
        <MscBillingTile
          appPublicUrl={environment.getApplication().publicURL}
          servicePath={`{{this.mainApiPath}}/${serviceName}`}
          locale={locale}
        />
      </div>
      <div className="p-3">
        <MscBillingTile
          appPublicUrl={environment.getApplication().publicURL}
          servicePath={`{{this.mainApiPath}}/${serviceName}`}
          locale={locale}
        />
      </div>
    </div>
  );
}

export default Tabs1;
