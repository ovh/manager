import { apiClient } from '@ovh-ux/manager-core-api';

export async function fetchServiceId(servicePath: string) {
  return apiClient.v6
    .get(`${servicePath}/serviceInfos`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error:', error);
    });
}

export async function fetchServiceDetails(serviceId: string) {
  return apiClient.v6
    .get(`/services/${serviceId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error:', error);
    });
}

export async function fetchDomainOwner(domain: string) {
  return apiClient.v6
    .get(`/domain/${domain}`)
    .then((response) => response.data.whoisOwner)
    .catch((error) => {
      console.error('Error:', error);
    });
}
