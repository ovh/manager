import { useLocation } from 'react-router-dom';

const productTypes = ['key-management-service', 'secret-manager', 'service-keys'] as const;

export type ProductType = (typeof productTypes)[number];

const isProductType = (productType: string | undefined): productType is ProductType => {
  return productTypes.includes(productType as ProductType);
};

export const useProductType = (): ProductType => {
  const location = useLocation();
  // Split the pathname by '/' and get the first non-empty segment
  const pathSegments = location.pathname.split('/').filter((segment) => segment);
  const productType = pathSegments[0];

  // Ensure the productType is one of the allowed values
  if (!isProductType(productType)) {
    throw new Error(`Invalid product type: ${productType}`);
  }

  return productType;
};
