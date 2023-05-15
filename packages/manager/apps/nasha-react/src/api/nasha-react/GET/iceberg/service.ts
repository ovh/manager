import { fetchIceberg } from '@ovh-ux/manager-core-api';

async function getServices() {
  try {
    const nashaList = await fetchIceberg({ route: '/dedicated/nasha' }).then(
      ({ data }) => data,
    );
    return nashaList;
  } catch (error) {
    return null;
  }
}

export default getServices;
