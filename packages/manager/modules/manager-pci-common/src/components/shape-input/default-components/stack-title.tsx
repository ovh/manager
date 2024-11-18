import React from 'react';

export const DefaultStackTitleComponent = ({
  stackKey,
}: {
  stackKey: string;
}): JSX.Element => (
  <div className="w-full">
    <table className="w-full">Items of: {stackKey}</table>
  </div>
);
