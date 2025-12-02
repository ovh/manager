export default {
  test: (val: unknown) => typeof val === 'string',

  print: (val: string) =>
    val
      // 1. Strip hashed CSS module classes (ODS + local modules)
      // Matches: _button_abc12_3 → _button
      .replace(/(_[a-zA-Z0-9-]+?)_[a-z0-9]{4,}_[0-9]+/g, '$1')

      // 2. Normalize auto-generated React/ODS IDs
      // Example: id="tabs::r1::list" or id=":r1j:"
      .replace(/id="[^"]*"/g, 'id="stable"')

      // 3. Remove Radix / ODS dynamic scope attributes
      .replace(/\s*data-scope="[^"]*"/g, '')
      .replace(/\s*data-part="[^"]*"/g, '')

      // 4. Replace dynamic inline styles (z-index, translate, element positioning)
      .replace(/style="[^"]*"/g, 'style=""')

      // 5. Normalize whitespace introduced by removals
      .replace(/\s+/g, ' ')
      .trim(),
};
