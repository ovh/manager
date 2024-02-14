import { UseQueryResult } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';

import { ai } from '@/models/types';

import GeneralCard from './_components/generalCard';
import LifeCycleCard from './_components/lifeCycleCard';
import ResourcesCard from './_components/resourcesCard';

export const Handle = {
  breadcrumb: () => 'General information',
};

export default function AiJobGeneralInformationPage() {
  const jobQuery = useOutletContext() as UseQueryResult<ai.job.Job, Error>;
  return (
    <>
      {jobQuery.isLoading ? (
        <p>Loading Job</p>
      ) : (
        <div>
          {jobQuery.data && (
            <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="max-w-full">
                <GeneralCard
                  job={jobQuery.data}
                  onLabelUpdate={() => jobQuery.refetch()}
                />
              </div>
              <div className="w-auto">
                <LifeCycleCard
                  job={jobQuery.data}
                  onJobUpdate={() => jobQuery.refetch()}
                />
              </div>
              <div className="w-auto">
                <ResourcesCard job={jobQuery.data} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
