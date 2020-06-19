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
      .then((universes) => {
        universes.push({
          universe: 'sms',
          url: '/sms',
        });
        universes.push({
          universe: 'freefax',
          url: '/freefax',
        });
        universes.push({
          universe: 'support',
          url: '/support',
        });
        return universes;
      })
      .then((data) => this.setState({ universes: data }));
  }

  render() {
    const { universes } = this.state;
    const { user } = this.state;
    const style = {
      paddingLeft: '2rem',
      lineHeight: '3rem',
      marginBottom: '1rem',
      boxShadow: '0 0 6px 0 rgba(0, 14, 156, 0.2)',
    };
    return (
      <div style={style}>
        <span>
          <b style={ {marginRight: '2rem'} }>OVHcloud</b>
          <span style={ {marginRight: '2rem'} }>REACT ({ version })</span>
          <span style={ {marginRight: '2rem'} }>{user.nichandle}</span>
          <span style={ { marginRight: '5rem' } }></span>
        </span>
        { universes.length ? universes.map(u =>
          <span>
            <a href={ u.url } style={ {marginRight: '2rem'} }>{ u.universe }</a>
          </span>
        ) : 'Loading universes...' }
      </div>
    );
  }
}
/* eslint-enable */
