import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { TProjectWithService } from '../project.type';
import { getProjects } from './projects';
import { getServices } from './services';
import { TService } from '../service.type';

/**
 * Retrieves a list of projects, each enriched with its corresponding service and an aggregated status.
 *
 * This function fetches both projects and services in parallel, then associates each project with its matching service
 * (based on the project ID and service resource name). Only projects that have a corresponding service are included in the result.
 * The aggregated status is set to 'unpaid' if the service's billing lifecycle state is 'unpaid', otherwise it uses the project's status.
 * The resulting list is sorted by project description.
 *
 * @returns A promise that resolves to a `FetchResultV6` containing an array of `TProjectWithService` objects,
 *          each representing a project with its associated service and aggregated status.
 */
export const getProjectsWithServices = async (): Promise<FetchResultV6<
  TProjectWithService
>> => {
  return Promise.all([getProjects(), getServices()]).then(
    ([projects, services]) => {
      return {
        data: projects.data
          .reduce(
            (
              projectsWithServices: TProjectWithService[],
              project: TProject,
            ) => {
              const service = services.data.find(
                (s: TService) => s.resource.name === project.project_id,
              );
              if (service) {
                return [
                  ...projectsWithServices,
                  {
                    ...project,
                    service,
                    aggregatedStatus: (service.billing.lifecycle.current
                      .state === 'unpaid'
                      ? 'unpaid'
                      : project.status) as TProjectWithService['aggregatedStatus'],
                  },
                ];
              }
              return projectsWithServices;
            },
            [] as TProjectWithService[],
          )
          // We sort by description so that even when sorting by status
          // the secondary sorting is still by description
          .sort((a: TProjectWithService, b: TProjectWithService) =>
            (a.description || '').localeCompare(b.description || ''),
          ),
      };
    },
  );
};

export const projectsWithServiceQueryKey = () => [
  '/services',
  '/cloud/project',
];
