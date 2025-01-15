export const getOfficeUsersQueryKey = (serviceName: string) => [
  'get',
  'license',
  'office',
  serviceName,
  'user',
];

export const getOfficeUserDetailQueryKey = (
  serviceName: string,
  activationEmail: string,
) => ['get', 'license', 'office', serviceName, 'user', activationEmail];
