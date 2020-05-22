import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export default class Play extends Component {
  render() {
    return (
      <div className="control-module__button dark-green">
        <FontAwesomeIcon icon={faPlay} fixedWidth />
        <span className="control-module__text">Play</span>
      </div>
    );
  }
}
