import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

export default function Loading() {
  return (
    <div data-testid="spinner" className="my-5 flex justify-center">
      <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
    </div>
  );
}
