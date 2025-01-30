import { useNavigate, useParams } from 'react-router-dom';
import { useGetJob } from '@/hooks/api/ai/job/useGetJob.hook';
import KillJob from '../[jobId]/_components/KillJob.component';

const KillJobModal = () => {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();
  const jobQuery = useGetJob(projectId, jobId);
  return <KillJob onSuccess={() => navigate('../')} job={jobQuery.data} />;
};

export default KillJobModal;
