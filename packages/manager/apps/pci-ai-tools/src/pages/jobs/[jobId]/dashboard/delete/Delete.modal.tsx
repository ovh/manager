import { useNavigate, useParams } from 'react-router-dom';
import DeleteJob from '../../_components/DeleteJob.component';
import { useGetJob } from '@/data/hooks/ai/job/useGetJob.hook';

const DeleteJobModal = () => {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();
  const jobQuery = useGetJob(projectId, jobId);
  return <DeleteJob onSuccess={() => navigate('../..')} job={jobQuery.data} />;
};

export default DeleteJobModal;
