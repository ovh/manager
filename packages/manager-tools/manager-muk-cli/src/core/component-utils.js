/**
 * Dynamically groups ODS components based on naming patterns.
 * Example:
 * ['tooltip', 'tooltip-content', 'tooltip-trigger'] ->
 * { tooltip: ['tooltip-content', 'tooltip-trigger'] }
 */
export function groupComponentsDynamically(components) {
  const grouped = {};

  // Find all root candidates (i.e. no dash)
  const roots = components.filter((c) => !c.includes('-'));

  for (const comp of components) {
    const base = comp.split('-')[0];
    if (roots.includes(base) && comp !== base) {
      grouped[base] ??= [];
      grouped[base].push(comp);
    } else if (!grouped[comp]) {
      grouped[comp] = [];
    }
  }

  return grouped;
}
