import React, { lazy } from 'react';
import TileCustom from '@/components/layout-helpers/Dashboard/TileCustom';

const TileToRename1 = lazy(() => import('./Tabs1/TileToRename1'));
const TileToRename2 = lazy(() => import('./Tabs1/TileToRename2'));
const TileToRename3 = lazy(() => import('./Tabs1/TileToRename3'));

function Tabs1() {
  return (
    <div className="dashboard-section">
      <div>
        <TileCustom title="TileToRename1">
          <TileToRename1 />
        </TileCustom>
      </div>
      <div>
        <TileCustom title="TileToRename2">
          <div>
            <TileToRename2 />
          </div>
        </TileCustom>
      </div>
      <div>
        <TileCustom title="TileToRename3">
          <TileToRename3 />
        </TileCustom>
      </div>
    </div>
  );
}

export default Tabs1;
