export const USING_LOAD_BALANCER_GUIDE_ID = 'using_load_balancer';
export const GUIDES = [
  {
    id: USING_LOAD_BALANCER_GUIDE_ID,
    URLS: {
      GB: 'https://docs.ovh.com/gb/en/kubernetes/using-lb/',
      CA: 'https://docs.ovh.com/ca/en/kubernetes/using-lb/',
      ASIA: 'https://docs.ovh.com/asia/en/kubernetes/using-lb/',
      AU: 'https://docs.ovh.com/au/en/kubernetes/using-lb/',
      IE: 'https://docs.ovh.com/ie/en/kubernetes/using-lb/',
      SG: 'https://docs.ovh.com/sg/en/kubernetes/using-lb/',
    },
  },
];
export const LOAD_BALANCER_CONFIGURE_TRACKING =
  'public-cloud::pci::projects::project::loadbalancer::configure';

export default {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  USING_LOAD_BALANCER_GUIDE_ID,
};
