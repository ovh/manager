import SELECTED_NAS from './config';

import { getPartition, service } from './GET/2api/service';
import { serviceInfos, serviceV6 } from './GET/apiv6/service';
import getServices from './GET/iceberg/service';
import iamRessources from './GET/apiV2/service';

import renameNasha from './PUT/apiv6/renameNasha';
import createNashaPartition from './POST/apiv6/createPartition';

export {
  service,
  serviceV6,
  getPartition,
  serviceInfos,
  getServices,
  renameNasha,
  createNashaPartition,
  iamRessources,
  SELECTED_NAS,
};
