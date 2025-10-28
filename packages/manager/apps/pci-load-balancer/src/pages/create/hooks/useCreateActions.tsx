import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useCreateStore } from '@/pages/create/store';
import { useGetFlavor } from '@/api/hook/useFlavors';
import { useCreateCallbacks } from './useCreateCallbacks';
import { FloatingIpSelectionId } from '@/types/floating.type';

export const useCreateActions = () => {
  const { trackClick } = useOvhTracking();
  const store = useCreateStore();
  const { projectId } = useParams();
  const { data: flavor } = useGetFlavor(
    projectId,
    store.region?.name,
    store.addon,
  );
  const { onSuccess, onError } = useCreateCallbacks();
  const navigate = useNavigate();

  const storeTracikngInfo = useMemo(
    () =>
      `${store.region?.name}_private_${store.addon?.size}_${
        store.publicIp === FloatingIpSelectionId.UNATTACHED
          ? 'unavailable'
          : 'available'
      }_${store.listeners.length}`,
    [store.region, store.addon, store.publicIp, store.listeners.length],
  );

  return {
    create: () => {
      trackClick({
        actions: ['confirm', `loadbalancer_added_${storeTracikngInfo}`],
        actionType: 'action',
        buttonType: ButtonType.button,
        location: PageLocation.funnel,
      });

      store.create(flavor, onSuccess, onError);
    },
    cancel: () => {
      trackClick({
        actions: ['cancel', storeTracikngInfo],
        actionType: 'action',
        buttonType: ButtonType.button,
        location: PageLocation.funnel,
      });
      store.reset();
      navigate('..');
    },
  };
};
