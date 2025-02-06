import { useNavigate, useParams } from 'react-router-dom';
import { useGetJob } from '@/hooks/api/ai/job/useGetJob.hook';
import RestartJob from '../[jobId]/_components/RestartJob.component';

const RestartJobModal = () => {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();
  const jobQuery = useGetJob(projectId, jobId);
  return (
    <RestartJob
      onSuccess={(job) => navigate(`../${job.id}`)}
      job={jobQuery.data}
    />
  );
};

export default RestartJobModal;
