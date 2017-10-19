import React, { Component } from 'react';
import shouldComponentUpdate from './shouldComponentUpdate';

export default function immutableRenderDecorator(Target) {
  // class Wrapper extends Component {
  //   render() {
  //     return React.createElement(Target, this.props, this.props.children);
  //   }
  // }

  Target.prototype.shouldComponentUpdate = shouldComponentUpdate;

  return Target;
}