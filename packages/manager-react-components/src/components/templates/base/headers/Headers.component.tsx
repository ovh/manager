import React from 'react';
import { Title } from '../../../typography';
import { HeadersProps } from './Headers.props';

export const Headers: React.FC<HeadersProps> = ({
  title,
  GuideMenu,
  changelogButton,
}) => {
  return (
    <header className="flex items-start justify-between">
      {title && <Title data-testid="title">{title}</Title>}
      {(GuideMenu || changelogButton) && (
        <div className="flex flex-wrap justify-end items-center">
          {changelogButton}
          {GuideMenu}
        </div>
      )}
    </header>
  );
};

export default Headers;
