import React from 'react';

export const DefaultStackLabelComponent = ({
  stackKey,
  isStackSelected,
  stackItems,
  isMobile,
}: {
  stackKey: string;
  isStackSelected: boolean;
  stackItems: unknown[];
  isMobile: boolean;
}): JSX.Element => (
  <div className="w-full">
    <table className="w-full">
      <tbody>
        <tr>
          <td>stackKey:</td>
          <td>{stackKey}</td>
        </tr>
        <tr>
          <td>isStackSelected:</td>
          <td>{isStackSelected ? 'true' : 'false'}</td>
        </tr>
        <tr>
          <td>items count:</td>
          <td>{stackItems?.length || 0}</td>
        </tr>
        <tr>
          <td>isMobile:</td>
          <td>{isMobile ? 'true' : 'false'}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
