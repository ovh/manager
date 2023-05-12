import { fetchIceberg } from '@ovh-ux/manager-core-api/src/iceberg';

async function getServices() {
  try {
    let nashaList;
    await fetchIceberg({ route: '/dedicated/nasha' }).then(({ data }) => {
      nashaList = data;
    });
    return nashaList;
  } catch (error) {
    return null;
  }
}

export default getServices;
