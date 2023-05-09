import SELECTED_NAS from './config';

import { getPartition, service } from './GET/2api/service';
import { serviceInfos } from './GET/apiv6/service';
import services from './GET/iceberg/service';

import renameNasha from './PUT/apiv6/renameNasha';
import createNashaPartition from './POST/apiv6/createPartition';

export {
  service,
  getPartition,
  serviceInfos,
  services,
  renameNasha,
  createNashaPartition,
  SELECTED_NAS,
};
