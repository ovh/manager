import { FEATURE_FLAGS } from '@/app.constants';
import { isEdgeCompatibleVDC } from '@/utils/edgeGatewayCompatibility';
import {
  useVcdDatacentre,
  VCF_ADVANCED_TESTING_MODE,
} from '@ovh-ux/manager-module-vcd-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';

export const useHasEdgeGatewayAccess = () => {
  const { id, vdcId } = useParams();
  const {
    data: featuresAvailable,
    isLoading: isLoadingFeatures,
  } = useFeatureAvailability([FEATURE_FLAGS.EDGE_GATEWAY]);
  const {
    data: vcdDatacentre,
    isLoading: isLoadingDatacentre,
  } = useVcdDatacentre(id, vdcId);

  if (VCF_ADVANCED_TESTING_MODE) {
    return { hasEdgeGatewayAccess: true, isLoading: false };
  }

  const hasFeatureAccess = !!featuresAvailable?.[FEATURE_FLAGS.EDGE_GATEWAY];
  const isCompatibleVDC = isEdgeCompatibleVDC(vcdDatacentre?.data);

  return {
    hasEdgeGatewayAccess: hasFeatureAccess && isCompatibleVDC,
    isLoading: isLoadingFeatures || isLoadingDatacentre,
  };
};
