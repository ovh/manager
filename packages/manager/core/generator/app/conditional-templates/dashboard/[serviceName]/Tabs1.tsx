import React, { lazy } from 'react';
import TileCustom from '@/components/layout-helpers/Dashboard/TileCustom';

const TileExemple = lazy(() => import('./Tabs1/TileExemple'));

function Tabs1() {
  return (
    <div className="dashboard-section pt-4">
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
