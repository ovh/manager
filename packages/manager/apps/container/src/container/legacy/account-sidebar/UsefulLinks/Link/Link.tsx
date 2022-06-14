import React from 'react';

import Anchor from './Anchor';
import Button from './Button';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const Link = ({ children = null }: Props): JSX.Element => {
  return <div>{children}</div>;
};

Link.Anchor = Anchor;
Link.Button = Button;

export default Link;
