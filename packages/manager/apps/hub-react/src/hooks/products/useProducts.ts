import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { HubProduct, ProductList } from '@/types/services.type';
import {
  DEFAULT_DISPLAYED_PRODUCTS,
  DEFAULT_DISPLAYED_SERVICES,
  productListingPages,
} from '@/components/products/Products.constants';

export const useProducts = (services: ProductList, expand = false) => {
  const { shell } = useContext(ShellContext);
  const [products, setProducts] = useState<HubProduct[]>([]);
  const servicesByProducts = services?.data || {};
  const productNames = Object.keys(servicesByProducts);

  useEffect(() => {
    const productsDisplayed: HubProduct[] = productNames
      .map((name: string & keyof typeof servicesByProducts) => {
        const { application, hash } = productListingPages[name] || {
          application: null,
          hash: null,
        };

        return {
          data: servicesByProducts[name].data.slice(
            0,
            DEFAULT_DISPLAYED_SERVICES,
          ),
          count: servicesByProducts[name].count,
          type: name,
          formattedType: name.toLowerCase().replace(/_/g, '-'),
          // Link to product page should be done on the BFF side
          link:
            application && hash
              ? (shell.navigation.getURL(application, hash, {}) as Promise<
                  string
                >)
              : Promise.resolve(null),
        };
      })
      .sort((productA, productB) => productB.count - productA.count)
      .slice(0, expand ? productNames.length : DEFAULT_DISPLAYED_PRODUCTS);
    setProducts(productsDisplayed);
  }, [expand]);

  return {
    products,
    canDisplayMore: productNames.length > DEFAULT_DISPLAYED_PRODUCTS,
  };
};
