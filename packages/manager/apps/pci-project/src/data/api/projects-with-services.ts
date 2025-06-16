import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { TProjectWithService } from '../project.type';
import { getProjects } from './projects';
import { getServices } from './services';
import { TService } from '../service.type';

export const getProjectsWithServices = async (): Promise<FetchResultV6<
  TProjectWithService
>> => {
  return Promise.all([getProjects(), getServices()]).then(
    ([projects, services]) => {
      const projectsWithServices: TProjectWithService[] = projects.data.map(
        (project) => ({
          ...project,
          service: services.data.find(
            (service: TService) => service.resource.name === project.project_id,
          ),
        }),
      );

      return {
        data: projectsWithServices,
      };
    },
  );
};

export const projectsWithServiceQueryKey = () => [
  '/services',
  '/cloud/project',
];
