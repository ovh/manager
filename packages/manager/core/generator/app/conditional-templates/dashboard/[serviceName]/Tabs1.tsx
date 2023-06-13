import React, { lazy } from 'react';
import TileCustom from '@/components/layout-helpers/Dashboard/TileCustom';

const TiileExemple = lazy(() => import('./Tabs1/TileExemple'));

function Tabs1() {
  return (
    <div className="dashboard-section">
      <div>
        <TileCustom title="tile-exemple">
          <TiileExemple />
        </TileCustom>
      </div>
      <div>
        <TileCustom title="tile-exemple-2">
          <div>
            <TiileExemple />
          </div>
        </TileCustom>
      </div>
      <div>
        <TileCustom title="tile-exemple-3">
          <TiileExemple />
        </TileCustom>
      </div>
    </div>
  );
}

export default Tabs1;
