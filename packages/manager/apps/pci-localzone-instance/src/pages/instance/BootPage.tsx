import { useNavigate, useParams } from 'react-router-dom';
import Boot from '@/components/instance/Boot';
import { useInstance } from '@/hooks/useInstance';

export default function BootPage() {
  const { projectId, instanceId } = useParams();
  const { data: instance } = useInstance(projectId || '', instanceId || '');

  const navigate = useNavigate();

  const onClose = () => {
    navigate('..');
  };
  return (
    <>{instance && <Boot instance={instance} onClose={() => onClose()} />}</>
  );
}
