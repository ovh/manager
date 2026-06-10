import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const EOS_LOAD_BALANCER_FEATURE = 'public-cloud:project:eos-load-balancer-test';

const useLoadBalancerEosAvailable = () => {
  const { data, isLoading, isError } = useFeatureAvailability([EOS_LOAD_BALANCER_FEATURE]);

  return {
    isAvailable: Boolean(data?.[EOS_LOAD_BALANCER_FEATURE]),
    isLoading,
    isError,
  };
};

export default useLoadBalancerEosAvailable;
