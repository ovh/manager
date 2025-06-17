import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { getDefaultProject, getProjects } from './projects';
import { getServices } from './services';
import { TProjectWithService } from '@/data/types/project.type';
import { TService } from '@/data/types/service.type';

/**
 * Sorts projects by default status first, then by description alphabetically.
 * Default projects are sorted to the top, followed by non-default projects sorted by description.
 *
 * @param firstProject - First project to compare
 * @param secondProject - Second project to compare
 * @returns Negative value if firstProject should come before secondProject, positive if secondProject should come before firstProject, 0 if equal
 */
export const sortProjectsByDefaultAndDescription = (
  firstProject: TProjectWithService,
  secondProject: TProjectWithService,
): number => {
  if (firstProject.isDefault === secondProject.isDefault) {
    return (firstProject.description || '').localeCompare(
      secondProject.description || '',
    );
  }
  return firstProject.isDefault ? -1 : 1;
};

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
          .sort(sortProjectsByDefaultAndDescription),
      };
    },
  );
};

export const projectsWithServiceQueryKey = () => [
  '/services',
  '/cloud/project',
  'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
];
