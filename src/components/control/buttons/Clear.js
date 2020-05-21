import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

export default class Clear extends Component {
  render() {
    return (
      <div className="control-module__button dark-blue">
        <FontAwesomeIcon icon={faMinusCircle} size="xl" fixedWidth />
        <span className="control-module__text">Clear</span>
      </div>
    );
  }
}
