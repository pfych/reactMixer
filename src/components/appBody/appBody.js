import React, { Component } from 'react';
import Menu from './menu/menu'
import MixerArea from './mixer/mixerArea'


class AppBody extends Component {
  render() {
    return (
      <div className="AppBody">
        <Menu />
        <MixerArea />
      </div>
    );
  }
}

export default AppBody;