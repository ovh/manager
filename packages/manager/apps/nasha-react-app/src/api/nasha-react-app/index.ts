import { SELECTED_NAS } from './config';
import { getNashaReactAppIds } from './GET/apiv6/listNasha';
import { getNashaPartition } from './GET/apiv6/partition';
import { getNashaServiceInfos } from './GET/apiv6/serviceInfos';
import { getNashaDetails } from './GET/apiv6/nashaDetails';

export {
  getNashaDetails,
  getNashaPartition,
  getNashaServiceInfos,
  getNashaReactAppIds,
  SELECTED_NAS
};
