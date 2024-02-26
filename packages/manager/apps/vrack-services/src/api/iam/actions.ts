export const vrackServicesActions = {
  API_OVH: {
    IAM_RESOURCE_TAG: {
      ADD: 'vrackServices:apiovh:iam/resource/tag/add',
      REMOVE: 'vrackServices:apiovh:iam/resource/tag/remove',
    },
    RESOURCE: {
      GET: 'vrackServices:apiovh:resource/get',
      EDIT: 'vrackServices:apiovh:resource/edit',
      ELIGIBLE_MANAGED_SERVICE: {
        GET: 'vrackServices:apiovh:resource/eligibleManagedService/get',
      },
      EVENT: { GET: 'vrackServices:apiovh:resource/event/get' },
      TASK: {
        GET: 'vrackServices:apiovh:resource/task/get',
      },
      STORAGE_NET_APP: {
        ATTACH: 'vrackServices:apiovh:storageNetApp/attach',
        DETACH: 'vrackServices:apiovh:storageNetApp/detach',
      },
      VRACK: { ATTACH: 'vrackServices:apiovh:vrack/attach' },
    },
    VRACK: { ATTACH: 'vrackServices:vrack:attach' },
  },
} as const;

/* enum VrackServiceActions {
  API_OVH_IAM_RESOURCE_TAG_ADD = 'vrackServices:apiovh:iam/resource/tag/add',
  API_OVH_IAM_RESOURCE_TAG_REMOVE = 'vrackServices:apiovh:iam/resource/tag/remove',
  API_OVH_IAM_RESOURCE_GET = 'vrackServices:apiovh:resource/get',
  API_OVH_IAM_RESOURCE_EDIT = 'vrackServices:apiovh:resource/edit',
  API_OVH_IAM_RESOURCE_ELIGIBLE_MANAGED_SERVICE_GET = 'vrackServices:apiovh:resource/eligibleManagedService/get',
}
 */
