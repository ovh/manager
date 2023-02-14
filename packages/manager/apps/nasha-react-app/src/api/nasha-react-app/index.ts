import { SELECTED_NAS } from './config';
import { fetchNashaList } from './GET/apiv6/listNasha';
import { fetchNashaPartition } from './GET/apiv6/partition';
import { fetchNashaServiceInfos } from './GET/apiv6/serviceInfos';
import { fetchNashaDetails } from './GET/apiv6/nashaDetails';

export {
  fetchNashaDetails,
  fetchNashaPartition,
  fetchNashaServiceInfos,
  fetchNashaList,
  SELECTED_NAS
};
