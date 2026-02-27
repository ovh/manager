import React from 'react';

export const LifecycleRuleContainer = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h4>{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};
