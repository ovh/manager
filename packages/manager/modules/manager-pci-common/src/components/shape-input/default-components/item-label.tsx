export const DefaultItemLabelComponent = ({
  item,
  isItemSelected,
  isMobile,
}: {
  item: unknown;
  isItemSelected: boolean;
  isMobile: boolean;
}): JSX.Element => (
  <div className="w-full">
    <table className="w-full">
      <tbody>
        <tr>
          <td>item:</td>
          <td>{String(item)}</td>
        </tr>
        <tr>
          <td>isItemSelected:</td>
          <td>{isItemSelected ? 'true' : 'false'}</td>
        </tr>
        <tr>
          <td>isMobile:</td>
          <td>{isMobile ? 'true' : 'false'}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
