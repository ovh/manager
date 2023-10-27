import { useParams } from 'react-router-dom';
import { useInstance } from '@/hooks/useInstance';

export const handle = {
  crumb: () => {
    return 'Edit';
  },
};

export default function EditPage() {
  const { projectId, instanceId } = useParams();
  const { data: instance } = useInstance(projectId || '', instanceId || '');

  return <>{instance && <p>Edit instance {instance.name}</p>}</>;
}
