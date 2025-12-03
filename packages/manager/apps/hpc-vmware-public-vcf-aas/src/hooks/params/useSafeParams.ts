import { useParams } from 'react-router-dom';

type TAppParams = 'id' | 'vdcId' | 'vrackSegmentId' | 'vrackNetworkId';
type TAppParamsRecord = Record<TAppParams, string>;

const useSafeParams = <T extends TAppParams>(keys: T[]) => {
  const params = useParams();

  keys.forEach((key) => {
    if (!params[key]) throw new Error(`Missing required param: ${key}`);
  });

  return params as TAppParamsRecord;
};

export const useOrganisationParams = () => useSafeParams(['id']);
export const useDatacentreParams = () => useSafeParams(['id', 'vdcId']);
export const useVrackSegmentParams = () => useSafeParams(['id', 'vdcId', 'vrackSegmentId']);
export const useVrackNetworkParams = () =>
  useSafeParams(['id', 'vdcId', 'vrackSegmentId', 'vrackNetworkId']);
