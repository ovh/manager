import { UseQueryResult } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';

import { ai } from '@/models/types';

import GeneralCard from './_components/generalCard';
import LifeCycleCard from './_components/lifeCycleCard';
import ResourcesCard from './_components/resourcesCard';

export const Handle = {
  breadcrumb: () => 'General information',
};

export default function AiAppGeneralInformationPage() {
  const appQuery = useOutletContext() as UseQueryResult<ai.app.App, Error>;
  return (
    <>
      {appQuery.isLoading ? (
        <p>Loading App</p>
      ) : (
        <div>
          {appQuery.data && (
            <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="max-w-full">
                <GeneralCard
                  app={appQuery.data}
                  onAppUpdate={() => appQuery.refetch()}
                />
              </div>
              <div className="w-auto">
                <LifeCycleCard
                  app={appQuery.data}
                  onAppUpdate={() => appQuery.refetch()}
                />
              </div>
              <div className="w-auto">
                <ResourcesCard 
                  app={appQuery.data} 
                  onAppUpdate={() => appQuery.refetch()}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
