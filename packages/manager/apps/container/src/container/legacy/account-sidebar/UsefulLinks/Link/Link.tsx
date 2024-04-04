import React from 'react';

import Anchor from './Anchor';
import Action from './Action';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const Link = ({ children = null }: Props): JSX.Element => {
  return <div>{children}</div>;
};

Link.Anchor = Anchor;
Link.Action = Action;

export default Link;
