import { useNavigate, useParams } from 'react-router-dom';
import KillJob from '../[jobId]/_components/KillJob.component';
import { useGetJob } from '@/data/hooks/ai/job/useGetJob.hook';

const KillJobModal = () => {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();
  const jobQuery = useGetJob(projectId, jobId);
  return <KillJob onSuccess={() => navigate('../')} job={jobQuery.data} />;
};

export default KillJobModal;
