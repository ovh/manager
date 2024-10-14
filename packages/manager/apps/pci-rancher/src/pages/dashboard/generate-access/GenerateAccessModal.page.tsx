import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import GenerateAccessModal from '@/components/Modal/GenerateAccessModal/GenerateAccesModal.component';
import useGenerateAccessDetail from '@/data/hooks/useGenerateAccessDetail/useGenerateAccessDetail';
import { useRancher } from '@/data/hooks/useRancher/useRancher';
import { TrackingEvent } from '@/utils/tracking';

const GenerateAccessModalPage = () => {
  const { data: rancher } = useRancher();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { generateAccesDetail, accessDetail } = useGenerateAccessDetail({
    projectId: projectId as string,
    rancherId: rancher.id,
  });

  return (
    <GenerateAccessModal
      rancher={rancher}
      onGenerateAccess={generateAccesDetail}
      accessDetail={accessDetail}
      onClose={() => {
        navigate('..');
        trackClick({
          actions: [
            accessDetail.username ? TrackingEvent.close : TrackingEvent.cancel,
          ],
        });
      }}
    />
  );
};

export default GenerateAccessModalPage;
