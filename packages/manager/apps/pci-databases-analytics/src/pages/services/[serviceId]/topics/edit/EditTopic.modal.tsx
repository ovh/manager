import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useGetTopics } from '@/hooks/api/database/topic/useGetTopics.hook';
import AddEditTopic from '../_components/AddEditTopic.component';

const EditTopiclModal = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const topicsQuery = useGetTopics(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const topics = topicsQuery.data;
  const editedTopic = topics?.find((t) => t.id === topicId);

  useEffect(() => {
    if (topics && !editedTopic) navigate('../');
  }, [topics, editedTopic]);

  if (!editedTopic) return <Skeleton />;

  return (
    <AddEditTopic service={service} topics={topics} editedTopic={editedTopic} />
  );
};

export default EditTopiclModal;
