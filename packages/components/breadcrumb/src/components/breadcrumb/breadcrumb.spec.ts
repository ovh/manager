import { newSpecPage } from '@stencil/core/testing';
import { Breadcrumb } from './breadcrumb';

describe('manager-breadcrumb', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [Breadcrumb],
      html: '<manager-breadcrumb></manager-breadcrumb>'
    });
    expect(root).toEqualHtml(`
      <manager-breadcrumb>
        <mock:shadow-root>
          <ul></ul>
        </mock:shadow-root>
      </manager-breadcrumb>
    `);
  });
});
