import { DATA_PROCESSING_TRACKING_PREFIX_FULL } from '../data-processing.constants';

export const GUIDES = [
  {
    id: 'overview',
    link: 'https://docs.ovh.com/gb/en/data-processing/overview/',
    tracker: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::onboarding::docs-overview`,
  },
  {
    id: 'quick_start',
    link: 'https://docs.ovh.com/gb/en/data-processing/submit-javascala/',
    tracker: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::onboarding::docs-spark`,
  },
  {
    id: 'monitor_job',
    link: 'https://docs.ovh.com/gb/en/data-processing/monitor/',
    tracker: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::onboarding::docs-monitor`,
  },
];

export const SPARK_URL = 'https://spark.apache.org/';

export default {
  GUIDES,
  SPARK_URL,
};
