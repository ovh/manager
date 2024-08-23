import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenerateAccessModal from '@/components/Modal/GenerateAccessModal/GenerateAccesModal.component';
import useGenerateAccessDetail from '@/data/hooks/useGenerateAccessDetail/useGenerateAccessDetail';
import { useRancher } from '@/data/hooks/useRancher/useRancher';
import { useTrackingAction } from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

const GenerateAccessModalPage = () => {
  const { data: rancher } = useRancher();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const trackAction = useTrackingAction();

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
        trackAction(
          TrackingPageView.GenerateAccessModal,
          accessDetail.username ? TrackingEvent.close : TrackingEvent.cancel,
        );
      }}
    />
  );
};

export default GenerateAccessModalPage;
