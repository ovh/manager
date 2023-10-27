interface Header {
  property: string;
  title: string;
}

interface Item {
  id: string;
  [key: string]: string | number;
}

interface ListingProps {
  headers: Header[];
  items: Item[];
}

export default function Listing({ headers, items }: ListingProps) {
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
                <td key={`${item.id}-${property}`}>{item[property]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
