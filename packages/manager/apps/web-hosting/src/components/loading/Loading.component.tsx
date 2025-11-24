import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

export default function Loading() {
  return (
    <div data-testid="spinner" className="flex justify-center my-5">
      <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
    </div>
  );
}
