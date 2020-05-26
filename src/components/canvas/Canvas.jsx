import React, { Component } from "react";
import "./Canvas.css";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameCounter: 0,
      epicycleCircles: [],
      drawingComplete: false,
      isPlaying: false,
      lines: [],
      innerHeight: 0,
      innerWidth: 0,
      initialWidth: 0,
      initialHeight: 0,
      numCircles: 150,
    };

    this.drawArea = React.createRef();
  }

  componentDidMount() {
    this.getInnerDimensions();
    setInterval(
      () => this.setState({ frameCounter: this.state.frameCounter + 1 }),
      50
    );
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
    const {
      epicycleCircles,
      frameCounter,
      initialHeight,
      initialWidth,
    } = this.state;
    const N = lines.length;
    const twoPi = 2 * Math.PI;
    let x = initialWidth / 2;
    let y = initialHeight / 2;
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
        {epicycleCircles.length > 0 &&
          this.getFrame(frameCounter % N, epicycleCircles, x, y, N, twoPi)}
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

  animateEpicycleCircles = (lines, epicycleCircles) => {
    const N = lines.length;
    const twoPi = 2 * Math.PI;
    let x = this.state.initialWidth / 2;
    let y = this.state.initialHeight / 2;
    return function () {
      for (let i = 0; i < N; i++) {
        setTimeout(function () {
          console.log(i);
          this.getFrame(i, epicycleCircles, x, y, N, twoPi);
        }, i * 100);
      }
    };
  };

  getFrame = (i, epicycleCircles, x, y, N, twoPi) => {
    let frame = [];
    for (let j = 0; j < epicycleCircles.length; j++) {
      const { r, kPrime, theta } = epicycleCircles[j];
      console.log(r + " " + kPrime + " " + theta);
      const newTheta = (kPrime * i * twoPi) / N + theta;
      const endX = x + r * Math.cos(newTheta);
      const endY = y - r * Math.sin(newTheta);
      frame.push(this.drawCircle(x, y, endX, endY, newTheta, r));
      x = endX;
      y = endY;
    }
    return frame;
  };

  drawCircle = (x, y, endX, endY, theta, radius) => {
    const arrowAngle = (5 * Math.PI) / 6;
    return (
      <React.Fragment>
        <circle
          r={radius}
          cx={x}
          cy={y}
          fillOpacity="0"
          stroke="#333333"
          strokeWidth="1"
        />
        <line
          x1={x}
          y1={y}
          x2={endX}
          y2={endY}
          strokeWidth="1"
          stroke="#FF1493"
        />
        <line
          x1={endX}
          y1={endY}
          x2={endX + (radius / 10) * Math.cos(theta - arrowAngle)}
          y2={endY - (radius / 10) * Math.sin(theta - arrowAngle)}
          strokeWidth="1"
          stroke="#FF1493"
        />
        <line
          x1={endX}
          y1={endY}
          x2={endX + (radius / 10) * Math.cos(theta + arrowAngle)}
          y2={endY - (radius / 10) * Math.sin(theta + arrowAngle)}
          strokeWidth="1"
          stroke="#FF1493"
        />
      </React.Fragment>
    );
  };

  drawEpicycleCircles = (epicycleCircles) => {
    const { initialHeight, initialWidth } = this.state;
    let drawing = [];
    let cxPath = initialWidth / 2;
    let cyPath = initialHeight / 2;

    for (let i = 0; i < epicycleCircles.length; i++) {
      const { r, theta } = epicycleCircles[i];
      //Draw the circle
      drawing.push(
        <circle
          key={i}
          r={r}
          cx={cxPath}
          cy={cyPath}
          fillOpacity="0"
          stroke="#333333"
          strokeWidth="1"
        />
      );

      let cxNext = cxPath + r * Math.cos(theta);
      let cyNext = cyPath - r * Math.sin(theta);

      //Draw a vector from the center of the circle
      drawing.push(
        <line
          x1={cxPath}
          y1={cyPath}
          x2={cxNext}
          y2={cyNext}
          strokeWidth="1"
          stroke="#FF1493"
        />
      );

      drawing.push(
        <line
          x1={cxNext}
          y1={cyNext}
          x2={cxNext + (r / 10) * Math.cos(theta - (5 * Math.PI) / 6)}
          y2={cyNext - (r / 10) * Math.sin(theta - (5 * Math.PI) / 6)}
          strokeWidth="1"
          stroke="#FF1493"
        />
      );

      drawing.push(
        <line
          x1={cxNext}
          y1={cyNext}
          x2={cxNext + (r / 10) * Math.cos(theta + (5 * Math.PI) / 6)}
          y2={cyNext - (r / 10) * Math.sin(theta + (5 * Math.PI) / 6)}
          strokeWidth="1"
          stroke="#FF1493"
        />
      );

      cxPath = cxNext;
      cyPath = cyNext;
    }
    return drawing.map((currentElement) => {
      return currentElement;
    });
  };

  /*
        Discrete Fourier Transform:

        Xk = Sum from n = 0 to N - 1 [Xn * exp(-2πikn/N)]
        Xk = Sum from n = 0 to N - 1 [Xn * (cos(2πkn/N) - i*sin(2πkn/N))]

        Let Xn = u + iv, then foil

        Xk = Sum from n = 0 to N - 1 [(u*cos(2πkn/N) + v*sin(2πkn/N)) + i(v*cos(2πkn/N) - u*sin(2πkn/N))]

        Radius(Xk) will equal Sqrt(a^2 + b^2), where a and b are the real and imaginary parts of the sum above
        Theta(Xk) will equal Arctan(b/a).
      */

  calculateCoefficients = () => {
    const { lines, initialHeight, initialWidth, numCircles } = this.state;
    const N = lines.length;
    const twoPi = 2 * Math.PI;
    const offset = numCircles / 2;

    let u = []; //Real component of Xn
    let v = []; //Imaginary component of Xn

    //Convert x and y to real and imaginary components on the complex plane
    //The center of the screen is 0 + 0i.
    for (let i = 0; i < N; i++) {
      u.push(lines[i].x - initialWidth / 2);
      v.push(initialHeight / 2 - lines[i].y);
    }

    let epicycleCircles = [];

    //Xk will loop from 0 to numCircles, but will store the values from
    //-numCircles/2 to numCircles/2
    for (let k = 0; k <= numCircles; k++) {
      let a = 0;
      let b = 0;
      const kPrime = k - offset;

      for (let n = 0; n < N; n++) {
        const cosTerm = Math.cos((twoPi * kPrime * n) / N);
        const sinTerm = Math.sin((twoPi * kPrime * n) / N);
        a += u[n] * cosTerm + v[n] * sinTerm;
        b += v[n] * cosTerm - u[n] * sinTerm;
      }

      a /= N;
      b /= N;

      const r = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      let theta = Math.atan2(b, a);
      if (theta < 0) theta += 2 * Math.PI;
      epicycleCircles.push({ r, theta, kPrime });
    }

    //Sort the circles by radius length
    epicycleCircles.sort(function (a, b) {
      return b.r - a.r;
    });

    this.setState({ epicycleCircles });
  };

  clearDrawing = () => {
    this.setState({
      lines: [],
      epicycleCircles: [],
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
