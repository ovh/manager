import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { getProjects, getDefaultProject } from './projects';
import { getServices } from './services';
import { TProjectWithService } from '@/data/types/project.type';
import { TService } from '@/data/types/service.type';

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
  return Promise.all([getProjects(), getServices(), getDefaultProject()]).then(
    ([projects, services, defaultProject]) => {
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
                    isDefault: defaultProject?.projectId === project.project_id,
                    isUnpaid:
                      service.billing.lifecycle.current.state === 'unpaid',
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
          // Sort by isDefault first, then by description
          .sort((a: TProjectWithService, b: TProjectWithService) => {
            if (a.isDefault === b.isDefault) {
              return (a.description || '').localeCompare(b.description || '');
            }
            return a.isDefault ? -1 : 1;
          }),
      };
    },
  );
};

export const projectsWithServiceQueryKey = () => [
  '/services',
  '/cloud/project',
  'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
];
