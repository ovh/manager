import React from 'react';

import PropTypes from 'prop-types';

import Anchor from './Anchor';
import Button from './Button';

type Props = {
  children: JSX.Element;
};

const Link = ({ children }: Props): JSX.Element => {
  return (
    <div>
      { children }
    </div>
  );
};

Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Link.defaultProps = {
  children: null,
};

Link.Anchor = Anchor;
Link.Button = Button;

export default Link;
