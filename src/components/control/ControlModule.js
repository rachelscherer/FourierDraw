import React, { Component } from "react";
import Play from "./buttons/Play";
import Pause from "./buttons/Pause";
import Clear from "./buttons/Clear";

import "./ControlModule.css";

export default class ControlModule extends Component {
  render() {
    return (
      <div className="control-module">
        <div onClick={() => this.props.play()}>
          <Play />
        </div>
        <div onClick={() => this.props.pause()}>
          <Pause />
        </div>
        <div onClick={() => this.props.clearDrawing()}>
          <Clear />
        </div>
      </div>
    );
  }
}
