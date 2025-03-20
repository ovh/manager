import { useNavigate, useParams } from 'react-router-dom';
import RestartJob from '../[jobId]/_components/RestartJob.component';
import { useGetJob } from '@/data/hooks/ai/job/useGetJob.hook';

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
