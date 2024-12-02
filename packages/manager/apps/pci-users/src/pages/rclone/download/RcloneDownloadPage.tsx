import RCloneDownloadModal from '@ovh-ux/manager-pci-common/src/components/rclone-download/RCloneDownload';
import { useSearchParams } from 'react-router-dom';

export default function RcloneDownloadPage() {
  const [searchParams] = useSearchParams();

  return <RCloneDownloadModal userId={searchParams.get('userId')} />;
}
