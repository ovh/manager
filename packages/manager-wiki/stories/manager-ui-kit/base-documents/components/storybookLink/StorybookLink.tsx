import { Link, type LinkProp } from '@ovhcloud/ods-react';
import { navigate } from '@storybook/addon-links';
import React, {
  type ComponentPropsWithRef,
  type JSX,
  type MouseEvent,
} from 'react';

interface Prop extends ComponentPropsWithRef<'a'>, Pick<LinkProp, 'disabled'> {
  kind?: string;
  story?: string;
  title?: string;
}

const InternalLink = ({ children, kind, story, title, ...prop }: Prop): JSX.Element => {
  return (
    <a
      { ...prop }
      href="#"
      onClick={ (e: MouseEvent) => {
        e.preventDefault();
        navigate(title ? { title } : { kind, story });
      }}>
      { children }
    </a>
  );
}

const StorybookLink = ({ children, ...prop }: Prop): JSX.Element => {
  return (
    <Link
      as={ InternalLink }
      { ...prop }>
      { children }
    </Link>
  )
};

export {
  StorybookLink,
};
