import SELECTED_NAS from './config';

import { getNashaPartition, getNashaDetails } from './GET/2api/service';
import { getNashaServiceInfos, getNashaList } from './GET/apiv6/service';

import renameNasha from './PUT/apiv6/renameNasha';
import createNashaPartition from './POST/apiv6/createPartition';

export {
  getNashaDetails,
  getNashaPartition,
  getNashaServiceInfos,
  getNashaList,
  renameNasha,
  createNashaPartition,
  SELECTED_NAS,
};
