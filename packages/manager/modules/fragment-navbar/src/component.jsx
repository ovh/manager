/* eslint-disable */
import React from 'react';

const version = React.version;

export class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      universes: [],
      user: props.user,
    };
  }

  componentDidMount() {
    fetch('/engine/2api/universes?version=beta', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json',
      },
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => this.setState({ universes: data }));
  }

  render() {
    const { universes } = this.state;
    const { user } = this.state;
    return (
      <div>
        <span>
          <b>OVHcloud REACT ({ version }) (logged as {user.nichandle})</b>
          <span>&nbsp;</span>
        </span>
        { universes.map(u =>
          <span>
            <a href={ u.url }>{ u.universe }</a>
            <span>&nbsp;</span>
          </span>
        )}
      </div>
    );
  }
}
/* eslint-enable */
