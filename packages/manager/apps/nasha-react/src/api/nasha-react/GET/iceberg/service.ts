import { fetchIceberg } from '@ovh-ux/manager-core-api/src/iceberg';

async function services() {
  try {
    let nashaList;
    await fetchIceberg({ route: '/dedicated/nasha' }).then(({ data }) => {
      nashaList = data;
    });
    return nashaList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default services;
