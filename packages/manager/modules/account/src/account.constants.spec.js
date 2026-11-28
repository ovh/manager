import { describe, expect, it } from 'vitest';

import siretTemplate from '../../sign-up/src/components/siret/siret.html?raw';
import {
  isAccountWriteRequest,
  removeConfirmationCheckbox,
} from './account.constants';

// Serialising the template drops comments, quotes boolean attributes and the
// "/>" of void elements: compare what is left once those are ignored.
const normalize = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/="[^"]*"/g, '')
    .replace(/\s*\/>/g, '>')
    .replace(/\s+/g, '');

describe('removeConfirmationCheckbox', () => {
  const result = removeConfirmationCheckbox(siretTemplate);

  it('keeps the checkbox in the sign-up template', () => {
    expect(siretTemplate).toContain('data-name="isCorrectCheckbox"');
  });

  it('removes only that checkbox for the account section', () => {
    expect(result).not.toContain('isCorrectCheckbox');
    expect(result).not.toContain('siret_information_confirmation_is_correct');
    // The VAT checkbox and the search form stay.
    expect(result).toContain('noVatCheckbox');
    expect(result).toContain('<siret-search-modal');
    // Nothing else is lost: the template only shrinks by the checkbox.
    const checkbox = siretTemplate.match(
      /<oui-checkbox\s+class="mb-4"[\s\S]*?<\/oui-checkbox>/,
    )[0];
    expect(normalize(result).length).toBe(
      normalize(siretTemplate).length - normalize(checkbox).length,
    );
  });
});

describe('isAccountWriteRequest', () => {
  it('lets reads through', () => {
    expect(isAccountWriteRequest({ method: 'GET', url: '/me' })).toBe(false);
    expect(isAccountWriteRequest({ url: '/me' })).toBe(false);
  });

  it('blocks every write', () => {
    ['POST', 'put', 'DELETE', 'PATCH'].forEach((method) =>
      expect(isAccountWriteRequest({ method, url: '/me/contact' })).toBe(true),
    );
  });

  it('lets read-only POSTs through', () => {
    expect(
      isAccountWriteRequest({ method: 'POST', url: '/newAccount/rules' }),
    ).toBe(false);
    expect(
      isAccountWriteRequest({
        method: 'POST',
        url:
          '/engine/api/v2/iam/resource/urn%3Av1%3Aeu%3Aaccount/authorization/check',
      }),
    ).toBe(false);
  });
});
