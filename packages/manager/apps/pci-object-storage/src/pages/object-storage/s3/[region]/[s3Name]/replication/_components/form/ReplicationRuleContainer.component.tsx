export const ReplicationRuleContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <h4>{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};
