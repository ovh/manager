import { FEATURE_FLAGS } from '@/app.constants';
import { isEdgeCompatibleVDC } from '@/utils/edgeGatewayCompatibility';
import { useVcdDatacentre } from '@ovh-ux/manager-module-vcd-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';

const TESTING_MODE = true; // TODO: [EDGE] remove when unmocking (testing only)

export const useHasEdgeGatewayAccess = () => {
  const { id, vdcId } = useParams();
  const { data: featuresAvailable } = useFeatureAvailability([
    FEATURE_FLAGS.EDGE_GATEWAY,
  ]);
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);

  if (TESTING_MODE) {
    return true;
  }

  return Boolean(
    featuresAvailable?.[FEATURE_FLAGS.EDGE_GATEWAY] &&
      isEdgeCompatibleVDC(vcdDatacentre?.data),
  );
};
