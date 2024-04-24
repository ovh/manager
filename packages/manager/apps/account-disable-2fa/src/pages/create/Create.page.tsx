import React from 'react';
import { Outlet } from 'react-router-dom';

export default function CreateRequest() {
  return (
    <>
      <h1>Create request</h1>
      <Outlet />
    </>
  );
}
