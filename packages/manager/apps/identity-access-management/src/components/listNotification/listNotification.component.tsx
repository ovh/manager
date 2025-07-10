export type ListNotification = {
  error: string;
  items: Array<{ id: string; label: string }>;
};

export const ListNotification = ({ items, error }: ListNotification) => {
  return (
    <div>
      <p>{error}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
};
