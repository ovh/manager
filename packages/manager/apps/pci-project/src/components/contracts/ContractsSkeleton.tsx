import { OdsSkeleton } from '@ovhcloud/ods-components/react';

export default function ContractsSkeleton() {
  return (
    <ul data-testid="contracts-skeleton" className="flex flex-col">
      {Array.from({ length: 4 }).map((_, idx) => (
        <li key={idx}>
          <OdsSkeleton />
        </li>
      ))}
    </ul>
  );
}
