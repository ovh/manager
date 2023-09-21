import React, { lazy } from 'react';
import { MscBillingTile } from '@ovhcloud/msc-react-billing-tile';
import TileCustom from '@/components/layout-helpers/Dashboard/TileCustom';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { Locale } from '@ovhcloud/msc-utils';

const TileExemple = lazy(() => import('./Tabs1/TileExemple'));

function Tabs1() {
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;

  return (
    <div className="dashboard-section pt-4">
      <div>
        <MscBillingTile
          servicePath={`/dedicated/nasha${window.location.hash.replace(
            '#',
            '',
          )}`}
          locale={locale}
        />
      </div>
      <div>
        <TileCustom title="tile-exemple">
          <TileExemple />
        </TileCustom>
      </div>
      <div>
        <TileCustom title="tile-exemple-2">
          <div>
            <TileExemple />
          </div>
        </TileCustom>
      </div>
      <div>
        <TileCustom title="tile-exemple-3">
          <TileExemple />
        </TileCustom>
      </div>
    </div>
  );
}

export default Tabs1;
