export type GetPublicCloudProjectProjectIdParams = {
  /** Project ID */
  projectId?: string;
};

export const getPublicCloudProjectProjectIdQueryKey = (
  params: GetPublicCloudProjectProjectIdParams,
) => [`get/publicCloud/project/${params.projectId}`];
