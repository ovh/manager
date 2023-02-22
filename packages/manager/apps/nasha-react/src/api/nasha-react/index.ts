import SELECTED_NAS from './config';
import fetchNashaList from './GET/apiv6/listNasha';
import fetchNashaPartition from './GET/2api/partition';
import fetchNashaServiceInfos from './GET/apiv6/serviceInfos';
import fetchNashaDetails from './GET/2api/nashaDetails';

import renameNasha from './PUT/apiv6/renameNasha';
import createNashaPartition from './POST/apiv6/createPartition';

export {
  fetchNashaDetails,
  fetchNashaPartition,
  fetchNashaServiceInfos,
  fetchNashaList,
  renameNasha,
  createNashaPartition,
  SELECTED_NAS,
};
