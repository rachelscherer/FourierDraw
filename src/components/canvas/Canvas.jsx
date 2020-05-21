import React, { Component } from "react";
import "./Canvas.css";

function Drawing({ lines, complete }) {
  let prevLine = lines[0];
  return (
    <svg className="draw-area-svg">
      {lines.map((line, index) => {
        if (index > 0) prevLine = lines[index - 1];
        return <DrawLine key={index} line={line} prevLine={prevLine} />;
      })}
      {complete && lines.length > 0 && (
        <DrawLine key="a" line={lines[0]} prevLine={lines[lines.length - 1]} />
      )}
    </svg>
  );
}

function DrawLine({ line, prevLine }) {
  return (
    <path
      className="draw-path"
      d={`M${line.x} ${line.y} L${prevLine.x} ${prevLine.y} Z`}
    />
  );
}

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      drawingComplete: false,
      lines: [],
    };

    this.drawArea = React.createRef();
  }

  componentDidMount() {
    this.getInnerDimensions();
    window.addEventListener("resize", this.getInnerDimensions, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getInnerDimensions);
  }

  getInnerDimensions = () => {
    this.setState({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });
  };

  handleMouseUp = () => {
    if (this.state.lines.length > 0) {
      this.setState({
        isDrawing: false,
        drawingComplete: true,
      });
    }
  };

  handleMouseDown = (e) => {
    if (e.button !== 0 || this.state.drawingComplete) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);

    this.setState({
      isDrawing: true,
      lines: [...this.state.lines, point],
    });
  };

  relativeCoordinatesForEvent = (e) => {
    const boundingRect = this.drawArea.current.getBoundingClientRect();
    const coordinates = {
      x: e.clientX - boundingRect.left,
      y: e.clientY - boundingRect.top,
    };
    return coordinates;
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing || this.state.drawingComplete) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(e);

    this.setState({
      isDrawing: true,
      lines: [...this.state.lines, point],
    });
  };

  render() {
    const { innerWidth, innerHeight, lines, drawingComplete } = this.state;
    return (
      <div
        style={{ width: innerWidth, height: innerHeight }}
        className="draw-area"
        ref={this.drawArea}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
      >
        <Drawing lines={lines} complete={drawingComplete} />
      </div>
    );
  }
}
