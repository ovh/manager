import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenerateAccessModal from '@/components/Modal/GenerateAccesModal';
import useGenerateAccessDetail from '@/hooks/useGenerateAccessDetail';
import { useRancher } from '@/hooks/useRancher';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

const GenerateAccessModalPage = () => {
  const { data } = useRancher();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const trackAction = useTrackingAction();

  const rancher = data.data;
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
