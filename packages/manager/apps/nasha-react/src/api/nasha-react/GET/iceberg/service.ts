import { fetchIceberg } from '@ovh-ux/manager-core-api';

async function getServices() {
  try {
    let nashaList;
    await fetchIceberg({ route: '/dedicated/nasha' }).then(({ data }: any) => {
      nashaList = data;
    });
    return nashaList;
  } catch (error) {
    return null;
  }
}

export default getServices;
