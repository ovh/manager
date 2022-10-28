import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, MenuItem, useMenuItem } from '@chakra-ui/react';

export type ActionButtonProps = {
  label: string;
  title?: string;
  to?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  isMenuItem?: boolean;
};

export default function ActionButton(props: ActionButtonProps): JSX.Element {
  const ParentComponent = props.isMenuItem ? MenuItem : Button;

  if (Object.prototype.hasOwnProperty.call(props, 'to')) {
    return (
      <ParentComponent
        as={RouterLink}
        to={props.to}
        aria-label={props.title || props.label}
        onClick={() => props.onClick?.()}
      >
        {props.label}
      </ParentComponent>
    );
  }

  if (Object.prototype.hasOwnProperty.call(props, 'href')) {
    return (
      <ParentComponent
        as={Link}
        href={props.href}
        isExternal={props.external}
        aria-label={props.title || props.label}
        onClick={() => props.onClick?.()}
      >
        {props.label}
      </ParentComponent>
    );
  }

  return (
    <ParentComponent
      as={Button}
      aria-label={props.title || props.label}
      onClick={() => props.onClick?.()}
    >
      {props.label}
    </ParentComponent>
  );
}
