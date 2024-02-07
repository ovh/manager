import { vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import Product from '@/components/vouchers/listing/Product';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('Product vouchers datagrid cell', () => {
  it('Product components should be rendered correctly a named product', () => {
    render(<Product product={['a product']} />);
    const productComponent = screen.getByText('a product');
    expect(productComponent).toMatchSnapshot();
  });
  it('Product components should be rendered correctly without named product', () => {
    render(<Product product={null} />);
    const productComponent = screen.getByText('cpb_vouchers_products_all');
    expect(productComponent).toMatchSnapshot();
  });
});
