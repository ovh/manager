import apiClient from '@ovh-ux/manager-core-api';

async function iamRessources() {
  try {
    const response = await apiClient.v2.get('/iam/resource');
    return response.data;
  } catch (error) {
    return null;
  }
}

export default iamRessources;
