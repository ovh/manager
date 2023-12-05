interface Header {
  property: string;
  title: string;
}

interface ListItem {
  id: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

interface ListingProps<T> {
  headers: Header[];
  items: T[];
}

export default function Listing<T extends ListItem>({
  headers,
  items,
}: ListingProps<T>) {
  return (
    <>
      <table>
        <thead>
          <tr>
            {headers.map(({ property, title }) => (
              <th key={property}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td></td>
              {headers.map(({ property }) => (
                <td key={`${item.id}-${property}`}>
                  {item[property]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
