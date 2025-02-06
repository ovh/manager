import { useNavigate, useParams } from 'react-router-dom';
import { useGetJob } from '@/hooks/api/ai/job/useGetJob.hook';
import DeleteJob from '../[jobId]/_components/DeleteJob.component';

const DeleteJobModal = () => {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();
  const jobQuery = useGetJob(projectId, jobId);
  return <DeleteJob onSuccess={() => navigate('../')} job={jobQuery.data} />;
};

export default DeleteJobModal;
