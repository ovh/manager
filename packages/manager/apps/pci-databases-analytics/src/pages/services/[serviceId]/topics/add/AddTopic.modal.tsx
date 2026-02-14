import { useServiceData } from '../../Service.context';
import { useGetTopics } from '@/data/hooks/database/topic/useGetTopics.hook';
import AddEditTopic from '../_components/AddEditTopic.component';

const AddTopic = () => {
  const { projectId, service } = useServiceData();
  const topicsQuery = useGetTopics(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  return <AddEditTopic service={service} topics={topicsQuery.data} />;
};

export default AddTopic;
