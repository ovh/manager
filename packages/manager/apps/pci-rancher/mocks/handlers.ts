import { Handler } from './utils';
import {
  CreateRancherPayload,
  RancherService,
  RancherTaskType,
  ResourceStatus,
} from '@/types/api.type';
import {
  deleteRancher,
  getRanchers,
  postRancherService,
  service,
  version,
} from './data';

// Define the base endpoint for the mock API
const endpoint = '/publicCloud/project/:projectId';

/**
 * Function to create mock rancher services and add them to the getRanchers array.
 * @param rancher - The rancher service to be added.
 * @returns The updated getRanchers array.
 */
const createRancherServiceMocks = (rancher: RancherService) => {
  getRanchers.push({ ...rancher });
  return getRanchers;
};

/**
 * Function to get a rancher service by its ID from the getRanchers array.
 * @param rancherId - The ID of the rancher service to retrieve.
 * @returns The rancher service with the specified ID.
 * @throws If the rancher service with the specified ID is not found.
 */
const getRancherByIdMock = (rancherId: string) => {
  const rancher = getRanchers.find((ranch) => ranch.id === rancherId);
  if (!rancher) {
    throw new Error(`Rancher with id ${rancherId} not found`);
  }

  return rancher;
};

/**
 * Function to update a rancher service's target specification.
 * @param data - The data containing the new target specification.
 * @param rancherId - The ID of the rancher service to update.
 * @param type - The type of update (default is 'plan').
 * @returns The updated rancher service.
 * @throws If the rancher service with the specified ID is not found.
 */
const updateRancher = (
  data: { targetSpec: RancherService['targetSpec'] },
  rancherId: string,
) => {
  const rancher = getRanchers.find((ranch) => ranch.id === rancherId);
  if (!rancher) {
    throw new Error(`Rancher with id ${rancherId} not found`);
  }

  rancher.currentState = { ...rancher.currentState, ...data.targetSpec };
  rancher.targetSpec = data.targetSpec;
  return rancher;
};

// Counter to track the number of times a rancher is created to be ready
let countCreateToReady = 0;

/**
 * Function to get the mock handlers for the rancher API endpoints.
 * @returns An array of Handler objects defining the mock API endpoints.
 */
export const getRancherMocks = (): Handler[] => [
  {
    url: `${endpoint}/reference/rancher/plan`,
    method: 'get',
    response: () => service,
    status: 200,
    api: 'v2',
  },
  {
    url: `${endpoint}/reference/rancher/version`,
    method: 'get',
    response: () => version,
    status: 200,
    api: 'v2',
  },
  {
    url: `${endpoint}/rancher`,
    method: 'post',
    async response({ request }) {
      const data = (await request.json()) as {
        targetSpec: CreateRancherPayload;
      };
      if (data) {
        if (!data.targetSpec.name) {
          return {
            json: {
              class: 'Client::BadRequest',
              message: '[targetSpec.name] Property cannot be null',
            },
            newStatus: 400,
          };
        }
        const rancher = postRancherService(data.targetSpec);
        createRancherServiceMocks(rancher);
        return rancher;
      }
      return {};
    },
    status: 201,
    api: 'v2',
  },
  {
    url: `${endpoint}/rancher`,
    method: 'get',
    async response() {
      countCreateToReady += 1;
      if (countCreateToReady === 3) {
        countCreateToReady = 0;
        return getRanchers
          .map((rancher) => {
            if (
              rancher.currentTasks[0].type === RancherTaskType.RANCHER_CREATE
            ) {
              // eslint-disable-next-line no-param-reassign
              rancher.resourceStatus = ResourceStatus.READY;
              // eslint-disable-next-line no-param-reassign
              rancher.currentTasks = [];
            }

            return rancher;
          })
          .filter(
            (rancher) => rancher.resourceStatus !== ResourceStatus.DELETING,
          );
      }
      return getRanchers;
    },

    status: 200,
    api: 'v2',
  },
  {
    method: 'get',
    url: `${endpoint}/rancher/:rancherId`,
    api: 'v2',
    response: async ({ params, context }) => {
      if (context.status === 404) {
        return {
          json: {
            class: 'Client::NotFound (MSW)',
            message: `Rancher  not found (MSW) ${params.rancherId as string}`,
          },
          newStatus: 404,
        };
      }

      return getRancherByIdMock(params.rancherId as string);
    },
    status: 200,
  },
  {
    method: 'put',
    url: `${endpoint}/rancher/:rancherId`,
    api: 'v2',
    response: async ({ request, params, context }) => {
      if (context.status === 404) {
        return {
          json: {
            class: 'Client::NotFound (MSW)',
            message: `Rancher  not found (MSW) ${params.rancherId as string}`,
          },
          newStatus: 404,
        };
      }
      const data = await request.json();
      return updateRancher(data, params.rancherId as string);
    },
    status: 200,
  },

  {
    url: `${endpoint}/rancher/:rancherId`,
    response: async ({ context, params }) => {
      if (context.status === 404) {
        return {
          json: {
            class: 'Client::NotFound (MSW)',
            message: `Rancher not found ${params.rancherId as string}`,
          },
          newStatus: 404,
        };
      }
      return deleteRancher;
    },
    method: 'delete',
    api: 'v2',
    status: 200,
  },
  {
    url: `${endpoint}/rancher/:rancherId/adminCredentials`,
    response: async ({ context }) => {
      if (context.status === 404) {
        return {
          json: {
            class: 'Client::NotFound (MSW)',
          },
          newStatus: 404,
        };
      }
      return { username: 'admin', password: 'toto' };
    },
    method: 'post',
    api: 'v2',
    status: 403,
  },
];
