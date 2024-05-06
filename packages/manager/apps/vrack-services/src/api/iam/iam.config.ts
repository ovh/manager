const iam: any = {
  actions: {
    'vrack-services.listing': [
      'vrackServices:apiovh:vrack/attach',
      'vrackServices:apiovh:resource/edit',
      'vrackServices:apiovh:resource/get',
    ],
    'vrack-services.dashboard': [
      'vrackServices:apiovh:resource/edit',
      'vrackServices:apiovh:resource/get',
      'vrackServices:apiovh:storageNetApp/detach',
      'vrackServices:apiovh:iam/resource/tag/remove',
    ],
    'vrack-services.subnets.listing': [
      'vrackServices:apiovh:resource/get',
      'vrackServices:apiovh:resource/edit',
    ],
    'vrack-services.subnets.onboarding': [
      'vrackServices:apiovh:storageNetApp/detach',
    ],
    'vrack-services.endpoints.listing': ['vrackServices:apiovh:vrack/attach'],
    'vrack-services.endpoints.onboarding': [
      'vrackServices:apiovh:resource/task/get',
    ],
    'vrack-services.subnets.create': [
      'vrackServices:apiovh:resource/eligibleManagedService/get',
    ],
  },
};
export default iam;
