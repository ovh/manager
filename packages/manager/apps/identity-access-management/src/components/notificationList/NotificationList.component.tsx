export type NotificationListProps = {
  error: string;
  items: Array<{ id: string; label: string }>;
};

export const NotificationList = ({ items, error }: NotificationListProps) => {
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
