import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Boot from '@/components/instance/Boot';
import { useInstance } from '@/hooks/useInstance';

export default function BootPage() {
  const { projectId } = useParams();
  const [urlSearchParams] = useSearchParams();
  const { data: instance } = useInstance(
    projectId || '',
    urlSearchParams.get('instanceId')?.toString() || '',
  );

  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <>{instance && <Boot instance={instance} onClose={() => onClose()} />}</>
  );
}
