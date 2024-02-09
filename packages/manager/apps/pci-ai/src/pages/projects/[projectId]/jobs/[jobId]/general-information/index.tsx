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
            <div className="flex flex-row gap-4">
              <div className="basis-1/3">
                <GeneralCard
                  job={jobQuery.data}
                  onLabelUpdate={() => jobQuery.refetch()}
                />
              </div>
              <div className="basis-1/3">
                <LifeCycleCard
                  job={jobQuery.data}
                  onJobUpdate={() => jobQuery.refetch()}
                />
              </div>
              <div className="basis-1/3">
                <ResourcesCard job={jobQuery.data} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
