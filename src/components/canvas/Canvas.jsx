import React, { Component } from "react";
import "./Canvas.css";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cR: [],
      cTheta: [],
      drawingComplete: false,
      isPlaying: false,
      lines: [],
      innerHeight: 0,
      innerWidth: 0,
      initialWidth: 0,
      initialHeight: 0,
      numCircles: 101,
    };

    this.drawArea = React.createRef();
  }

  componentDidMount() {
    this.getInnerDimensions();
    window.addEventListener("resize", this.getInnerDimensions, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.clearDrawing !== prevProps.clearDrawing) {
      this.clearDrawing();
    }

    if (this.props.play !== prevProps.play) {
      this.calculateCoefficients();
    }

    if (this.props.pause !== prevProps.pause) {
      //To do
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getInnerDimensions);
  }

  getDrawing = (lines, complete) => {
    const { cR, cTheta } = this.state;
    let prevLine = lines[0];
    return (
      <svg className="draw-area-svg">
        {lines.map((line, index) => {
          if (index > 0) prevLine = lines[index - 1];
          return this.drawLine(line, prevLine, index);
        })}
        {complete &&
          lines.length > 0 &&
          this.drawLine(lines[0], lines[lines.length - 1])}
        {cR.length > 0 && this.drawEpicycleCircles(cR, cTheta)}
      </svg>
    );
  };

  drawLine = (line, prevLine, index) => {
    const xOffset = (this.state.initialWidth - window.innerWidth) / 2;
    const yOffset = (this.state.initialHeight - window.innerHeight) / 2;
    return (
      <path
        key={index}
        className="draw-path"
        d={`M${line.x - xOffset} ${line.y - yOffset} L${prevLine.x - xOffset} ${
          prevLine.y - yOffset
        } Z`}
      />
    );
  };

  drawEpicycleCircles = (r, theta) => {
    const { initialHeight, initialWidth } = this.state;

    let drawing = [];
    let cxPath = initialWidth / 2;
    let cyPath = initialHeight / 2;
    let index = Math.floor(r.length / 2);
    let counter = 1;

    while (index >= 0 && index < r.length) {
      drawing.push(
        <circle
          key={index}
          r={r[index]}
          cx={cxPath}
          cy={cyPath}
          fillOpacity="0"
          stroke="#333333"
          strokeWidth="1"
        />
      );

      let cxNext = cxPath + r[index] * Math.cos(theta[index]);
      let cyNext = cyPath + r[index] * Math.sin(theta[index]);

      drawing.push(
        <line
          x1={cxPath}
          y1={cyPath}
          x2={cxNext}
          y2={cyNext}
          strokeWidth="1"
          stroke="#666666"
        />
      );

      cxPath = cxNext;
      cyPath = cyNext;

      if (counter % 2 === 0) {
        index += counter++;
      } else {
        index -= counter++;
      }
    }
    return drawing.map((currentElement) => {
      return currentElement;
    });
  };

  calculateCoefficients = () => {
    const { lines, initialHeight, initialWidth, numCircles } = this.state;
    const l = lines.length;

    let r = [];
    let theta = [];

    //Calculate r and theta for each coordinate
    for (let i = 0; i < l; i++) {
      //Adjust x and y such that the center of screen = (0,0)
      const x = lines[i].x - initialWidth / 2;
      const y = initialHeight / 2 - lines[i].y;

      //Calculate the R and θ components from the X and Y components
      r.push(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
      let arctan = Math.atan(y / x);

      //Give θ the domain 0 < θ < 2π
      if (x < 0) {
        arctan += (Math.PI * 3) / 2;
      } else {
        arctan += Math.PI / 2;
      }
      theta.push(arctan);
    }

    //Calculate { Cn(r,θ) | n = { -50 ... 50} }
    let cR = [];
    let cTheta = [];
    for (let i = 0; i < numCircles; i++) {
      //Get the X and Y component of each epicycle circle
      let CnX = 0;
      let CnY = 0;
      for (let t = 0; t < l; t++) {
        //X component of Cn = Sum over T( r(t) * cos(θ(t) - 2πn(t/total t)))/total t
        //Y component of Cn = Sum over T( r(t) * sin(θ(t) - 2πn(t/total t)))/total t
        CnX +=
          r[t] * Math.cos(theta[t] - (2 * Math.PI * (i - 50) * (t + 1)) / l);
        CnY +=
          r[t] * Math.sin(theta[t] - (2 * Math.PI * (i - 50) * (t + 1)) / l);
      }
      CnX /= l;
      CnY /= l;

      //Calculate the R and θ components from the X and Y components
      cR[i] = Math.sqrt(Math.pow(CnX, 2) + Math.pow(CnY, 2));
      cTheta[i] = Math.atan(CnY / CnX);

      //Give θ the domain 0 < θ < 2π
      if (cTheta[i] < 0) {
        cTheta[i] += (Math.PI * 3) / 2;
      } else {
        cTheta[i] += Math.PI / 2;
      }
    }

    this.setState({ cR, cTheta });
  };

  clearDrawing = () => {
    this.setState({
      lines: [],
      cR: [],
      cTheta: [],
      isDrawing: false,
      drawingComplete: false,
    });
  };

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

    const point = this.getCoordinates(e);

    this.setState({
      initialHeight: window.innerHeight,
      initialWidth: window.innerWidth,
      isDrawing: true,
      lines: [...this.state.lines, point],
    });
  };

  getCoordinates = (e) => {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing || this.state.drawingComplete) {
      return;
    }

    const point = this.getCoordinates(e);

    this.setState({
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
        {this.getDrawing(lines, drawingComplete)}
      </div>
    );
  }
}
