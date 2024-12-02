import { Suspense } from 'react';
import { Outlet, useParams } from 'react-router-dom';

export default function ObjectPage() {
  const { storageId } = useParams();
  return (
    <>
      Object {storageId}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
