import { describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import MyWebsitesPage from './MyWebsites.page';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';

describe('ManagedWordpressPage Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<MyWebsitesPage />);
    const sortedRows = getByTestId('header-defaultFQDN');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_fqdn,
    );
  });
});
