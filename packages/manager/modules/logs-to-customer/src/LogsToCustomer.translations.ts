import { MODULE_NAME } from '@/LogsToCustomer.constants';

export const NAMESPACE_PREFIX = MODULE_NAME;

export const NAMESPACES = {
  ERROR: `${NAMESPACE_PREFIX}/error`,
  LOG_KIND: `${NAMESPACE_PREFIX}/logKind`,
  LOG_SERVICE: `${NAMESPACE_PREFIX}/logService`,
  LOG_STREAM: `${NAMESPACE_PREFIX}/logStream`,
  LOG_STREAMS: `${NAMESPACE_PREFIX}/logStreams`,
  LOG_SUBSCRIPTION: `${NAMESPACE_PREFIX}/logSubscription`,
  LOG_TAIL: `${NAMESPACE_PREFIX}/logTail`,
};
