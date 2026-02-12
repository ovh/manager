import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

export default function Loading({
  className = 'flex justify-center my-5',
  size = SPINNER_SIZE.md,
}: {
  className?: string;
  size?: SPINNER_SIZE;
}) {
  return (
    <div data-testid="spinner" className={className}>
      <Spinner size={size} />
    </div>
  );
}
