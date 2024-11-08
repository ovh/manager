import { useNavigate, useParams } from 'react-router-dom';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';
import { useTracking } from './useTracking';
import { useCreateStore } from '@/pages/create/store';
import { useGetFlavor } from '@/api/hook/useFlavors';
import { useCreateCallbacks } from './useCreateCallbacks';

export const useCreateActions = () => {
  const { trackClick } = useTracking();
  const store = useCreateStore();
  const { projectId } = useParams();
  const { data: flavor } = useGetFlavor(
    projectId,
    store.region?.name,
    store.addon,
  );
  const { onSuccess, onError } = useCreateCallbacks();
  const navigate = useNavigate();

  return {
    create: () => {
      trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING.SUBMIT,
        type: 'action',
      });

      trackClick({
        name: `${LOAD_BALANCER_CREATION_TRACKING.CONFIRM}::${store.addon.code}::${store.region.name}`,
        type: 'action',
      });

      store.create(flavor, onSuccess, onError);
    },
    cancel: () => {
      trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
        type: 'action',
      });
      store.reset();
      navigate('..');
    },
  };
};
