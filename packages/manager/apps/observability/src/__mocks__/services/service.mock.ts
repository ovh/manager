import { ObservabilityService } from '@/types/observability.type';

const servicesDataset: ObservabilityService[] = [
  { id: 'ldp-zf-15501', currentState: { displayName: null } },
  { id: 'ldp-et-42418', currentState: { displayName: null } },
  { id: 'ldp-ms-91722', currentState: { displayName: null } },
  { id: 'ldp-gr-55078', currentState: { displayName: null } },
  { id: 'ldp-io-61871', currentState: { displayName: null } },
  { id: 'ldp-dq-82324', currentState: { displayName: null } },
  { id: 'ldp-jr-81953', currentState: { displayName: null } },
  { id: 'ldp-jj-29716', currentState: { displayName: null } },
  { id: 'ldp-tt-48060', currentState: { displayName: null } },
  { id: 'ldp-np-43247', currentState: { displayName: null } },
  { id: 'ldp-ro-08038', currentState: { displayName: null } },
  { id: 'ldp-ju-54500', currentState: { displayName: null } },
  { id: 'ldp-nv-47025', currentState: { displayName: null } },
  { id: 'ldp-pe-11160', currentState: { displayName: null } },
  { id: 'ldp-mg-73834', currentState: { displayName: null } },
  { id: 'ldp-yy-24693', currentState: { displayName: null } },
  { id: 'ldp-iz-25481', currentState: { displayName: '[DO NOT TOUCH] TTA TRS Quality' } },
  { id: 'ldp-xa-17103', currentState: { displayName: null } },
  { id: 'ldp-np-20814', currentState: { displayName: 'Christian' } },
  { id: 'ldp-ni-50732', currentState: { displayName: null } },
  { id: 'ldp-an-17655', currentState: { displayName: null } },
  { id: 'ldp-hy-49770', currentState: { displayName: 'ldp-hy-49770' } },
  { id: 'ldp-la-85440', currentState: { displayName: 'do not touch' } },
  { id: 'ldp-xq-98460', currentState: { displayName: 'Name' } },
  { id: 'ldp-fr-36016', currentState: { displayName: null } },
  { id: 'ldp-ga-90239', currentState: { displayName: 'Ele QA' } },
  { id: 'ldp-ib-84974', currentState: { displayName: null } },
  { id: 'ldp-rg-93836', currentState: { displayName: '[DO NOT TOUCH] Monito Pingdom' } },
];

export const getObservabilityServices = async (
  signal: AbortSignal,
): Promise<ObservabilityService[]> => {
  console.info(`[MOCK-ADAPTER][getObservabilityServices] > `, signal);
  return Promise.resolve(servicesDataset);
};
