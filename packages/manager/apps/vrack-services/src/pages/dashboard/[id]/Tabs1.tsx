import React from 'react';
import { MscBillingTile } from '@ovhcloud/msc-react-billing-tile';
import { useParams } from 'react-router-dom';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { Locale } from '@ovhcloud/msc-utils';

function Tabs1() {
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;
  const { id } = useParams();

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      <div className="p-3">
        <MscBillingTile servicePath={`/${id}`} locale={locale} />
      </div>
      <div className="p-3">
        <MscBillingTile servicePath={`/${id}`} locale={locale} />
      </div>
      <div className="p-3">
        <MscBillingTile
          servicePath={`/vrackServices/resource/${id}`}
          locale={locale}
        />
      </div>
    </div>
  );
}

export default Tabs1;
