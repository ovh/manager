import { fetchAttachmentUrl } from "@/data/api/notification";
import useTracking from "@/hooks/useTracking/useTracking";
import { TrackingSubApps } from "@/tracking.constant";
import { ButtonType, PageLocation } from "@ovh-ux/manager-react-shell-client";
import { Button, Icon } from "@ovhcloud/ods-react";
import { useState } from "react";


export default function AttachmentLink({
  notificationId,
  name,
}: {
  notificationId: string;
  name: string;
}) {
  const { trackClick } = useTracking();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const detail = await fetchAttachmentUrl(notificationId, name);
      window.open(detail.url, "_blank", "noopener,noreferrer");
    } catch {
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
    variant="outline"
    size="sm"
    disabled={isDownloading}
    loading={isDownloading}
    onClick={(e) => {
      handleDownload(e);
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actionType: 'download',
        actions: ['download_subject-file'],
        subApp: TrackingSubApps.Communications,
      });
    }}
  >
    <Icon name={"download"} />
    {name}
  </Button>
  );
}
