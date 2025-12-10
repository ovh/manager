import OkmsTerminateModal from '@/common/components/okms-terminate-modal/OkmsTerminateModal.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const OkmsTerminateModalPage = () => {
  const { okmsId } = useRequiredParams('okmsId');

  return <OkmsTerminateModal okmsId={okmsId} />;
};

export default OkmsTerminateModalPage;
