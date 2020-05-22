import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";

export default class Pause extends Component {
  render() {
    return (
      <div className="control-module__button dark-red">
        <FontAwesomeIcon icon={faPause} fixedWidth />
        <span className="control-module__text">Pause</span>
      </div>
    );
  }
}
