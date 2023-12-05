import { useReket } from '@ovh-ux/ovh-reket';

export type PciProject = {
  access: string;
  creationDate: Date;
  description: string;
  expiration: Date;
  manualQuota: boolean;
  orderId: unknown;
  planCode: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
};

type Service = {
  billing: {
    lifecycle: {
      current: {
        state: string
      }
    }
  }
  resource: {
    name: string
  }
}

export const getPciProjects = async (): Promise<PciProject[]> => {
  const reketInstance = useReket();
  const cloudProject: PciProject[] = await reketInstance.get('/cloud/project', {
    headers: {
      'X-Pagination-Filter': 'status:in=creating,ok,suspended',
      'X-Pagination-Mode': 'CachedObjectList-Cursor',
      'X-Pagination-Sort': 'description',
      'X-Pagination-Sort-Order': 'ASC',
      'X-Pagination-Size': 5000,
      'Pragma': 'no-cache',
    },
  });
  const projectIds = cloudProject.map(({ project_id }) => project_id).join(',');
  const services: Service[] = await reketInstance.get('/services', {
    headers: {
      'X-Pagination-Filter': `resource.name:in=${projectIds}`,
      'X-Pagination-Mode': 'CachedObjectList-Cursor',
      'Pragma': 'no-cache',
    },
  });
  return cloudProject.filter(({ project_id }) =>
    services.find(({ resource: { name } }) => project_id === name)
      ?.billing.lifecycle.current.state !== 'terminated'
  );
};
