import React from 'react';

import Anchor from './Anchor.jsx';
import Button from './Button.jsx';

const Link = ({ children }) => {
  return (
    <div>
      { children }
    </div>
  );
};

Link.Anchor = Anchor;
Link.Button = Button;

export default Link;
