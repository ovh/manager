import { describe, expect } from 'vitest';

import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import ManagedWordpressPage from './ManagedWordpress.page';

describe('ManagedWordpressPage Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<ManagedWordpressPage />);
    const sortedRows = getByTestId('header-id');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_resource,
    );
  });
});
