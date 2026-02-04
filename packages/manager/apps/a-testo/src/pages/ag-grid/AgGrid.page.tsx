import { BaseLayout, Breadcrumb } from '@ovh-ux/muk';
import { useDataApi } from '@ovh-ux/muk';
import { useMemo, useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
// ModuleRegistry.registerModules([AllCommunityModule]);

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

const AgGridPage = () => {
  const { flattenData, isLoading } = useDataApi({
    route: '/dedicated/server',
    version: 'v6',
    cacheKey: ['dedicated-server'],
    iceberg: true,
    enabled: true,
  });
  return (
    <BaseLayout
      header={{ title: 'AgGrid' }}
      breadcrumb={<Breadcrumb appName="a-testo" rootLabel="a-testo" />}
    >
      <div>AgGridPage</div>
    </BaseLayout>
  );
};

export default AgGridPage;