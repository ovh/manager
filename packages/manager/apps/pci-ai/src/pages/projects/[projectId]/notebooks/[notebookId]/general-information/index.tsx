import { UseQueryResult} from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';

import { ai } from '@/models/types';

import GeneralCard from './_components/generalCard';
import LifeCycleCard from './_components/lifeCycleCard';
import ResourcesCard from './_components/resourcesCard';

export const Handle = {
  breadcrumb: () => 'General information',
};

export default function AiNotebooksGeneralInformationPage() {
  const notebookQuery = useOutletContext() as UseQueryResult<
    ai.notebook.Notebook,
    Error
  >;
  return (
    <>
      {notebookQuery.isLoading ? (
        <p>Loading notebook</p>
      ) : (
        <div>
          {notebookQuery.data && (
            <div className="flex flex-row gap-4">
              <div className="basis-1/3">
                <GeneralCard 
                  notebook={notebookQuery.data}
                  onLabelUpdate={() => notebookQuery.refetch()}
                />
              </div>
              <div className="basis-1/3">
                <LifeCycleCard 
                  notebook={notebookQuery.data} 
                  onNotebookUpdate={() => notebookQuery.refetch()}
                />
              </div>
              <div className="basis-1/3">
                <ResourcesCard notebook={notebookQuery.data} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
