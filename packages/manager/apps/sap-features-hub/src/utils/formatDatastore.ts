import {
  Datastore,
  FormattedDatastore,
  VsanDatastore,
} from '@/types/datastore.type';

export const formatDatastore = (
  datastore: Datastore | VsanDatastore,
): FormattedDatastore => {
  const isVsan = 'clusterId' in datastore;
  return isVsan
    ? { ...datastore, isVsan }
    : { ...datastore, isVsan, datastoreName: datastore.name };
};
