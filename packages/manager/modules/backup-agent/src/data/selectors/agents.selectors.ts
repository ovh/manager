import type { Agent } from '@/types/Agent.type';
import type { AgentResource } from '@/types/Resource.type';

export const selectHasAgentEnabled = (agents: AgentResource<Agent>[]) =>
  agents.some((agent) => agent.status === 'ENABLED');
