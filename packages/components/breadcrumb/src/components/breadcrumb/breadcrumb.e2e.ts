import { newE2EPage } from '@stencil/core/testing';

describe('manager-breadcrumb', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<manager-breadcrumb></manager-breadcrumb>');
    const element = await page.find('manager-breadcrumb');
    expect(element).toHaveClass('hydrated');
  });
});
