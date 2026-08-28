/**
 * The Digital Agent is served by the Manager V7, mounted under /beta/ on the
 * same origin as the V6 manager.
 */

/** Regions on which the Digital Agent replaces the Help Center entry points. */
export const DIGITAL_AGENT_REGIONS = ['EU'];

/** Subsidiaries for which the Digital Agent replaces the Help Center entry points. */
export const DIGITAL_AGENT_SUBSIDIARIES = ['FR'];

/**
 * The Digital Agent is opened in primary for FR customers on the EU manager
 * only. Every other region / subsidiary keeps the Help Center links.
 */
export const isDigitalAgentEnabled = (region: string, ovhSubsidiary: string): boolean =>
  DIGITAL_AGENT_REGIONS.includes(region) && DIGITAL_AGENT_SUBSIDIARIES.includes(ovhSubsidiary);
