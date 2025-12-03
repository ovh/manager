import OkmsTerminateModal from '@/common/components/okms-terminate-modal/OkmsTerminateModal.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

export default function TerminateKms() {
  const { okmsId } = useRequiredParams('okmsId');

  return <OkmsTerminateModal okmsId={okmsId} />;
}
