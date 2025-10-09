/**
 * Dynamically groups ODS components based on naming patterns.
 * Example:
 * ['tooltip', 'tooltip-content', 'tooltip-trigger'] ->
 * { tooltip: ['tooltip-content', 'tooltip-trigger'] }
 */
export function groupComponentsDynamically(components) {
  const grouped = {};

  for (const name of components) {
    const [parent, ...rest] = name.split('-');
    const child = rest.length ? rest.join('-') : null;

    if (!grouped[parent]) grouped[parent] = [];
    if (child) grouped[parent].push(name);
  }

  return grouped;
}
