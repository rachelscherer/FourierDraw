import React, { Component } from "react";
import Play from "./buttons/Play";
import Pause from "./buttons/Pause";
import Clear from "./buttons/Clear";

import "./ControlModule.css";

export default class ControlModule extends Component {
  render() {
    return (
      <div className="control-module">
        <Play />
        <Pause />
        <Clear />
      </div>
    );
  }
}
