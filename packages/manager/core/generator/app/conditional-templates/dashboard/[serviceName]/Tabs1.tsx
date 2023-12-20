import React from 'react';
import { OsdsTile } from '@ovhcloud/ods-components/Tile/react';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';

function Tabs1() {
  const environment = useEnvironment();

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      <div className="p-3">
        <OsdsTile>Tile 1</OsdsTile>
      </div>
      <div className="p-3">
        <OsdsTile>Tile 2</OsdsTile>
      </div>
      <div className="p-3">
        <OsdsTile>Tile 3</OsdsTile>
      </div>
    </div>
  );
}

export default Tabs1;
