import { useLocation } from 'react-router-dom';

const productTypes = ['key-management-service', 'secret-manager'] as const;

export type ProductType = typeof productTypes[number];

const isProductType = (productType: string): productType is ProductType => {
  return productTypes.includes(productType as ProductType);
};

const useProductType = (): ProductType | null => {
  const location = useLocation();
  // Split the pathname by '/' and get the first non-empty segment
  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);
  const productType = pathSegments[0];

  // Ensure the productType is one of the allowed values
  if (!isProductType(productType)) {
    return null;
  }
  return productType;
};

export default useProductType;
