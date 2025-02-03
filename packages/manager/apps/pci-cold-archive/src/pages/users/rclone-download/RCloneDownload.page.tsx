import RCloneDownloadModal from '@ovh-ux/manager-pci-common/src/components/rclone-download/RCloneDownload';
import { useSearchParams } from 'react-router-dom';

export default function RCloneDownload() {
  const [searchParams] = useSearchParams();

  return <RCloneDownloadModal userId={searchParams.get('userId')} />;
}
