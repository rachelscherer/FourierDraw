import React, { Component } from "react";
import ControlModule from "../control/ControlModule";
import "./Sidebar.css";

export default class Sidebar extends Component {
  render() {
    return (
      <div className="side-bar">
        <ControlModule />
      </div>
    );
  }
}
