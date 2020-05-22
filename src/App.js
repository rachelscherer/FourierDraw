import React, { Component } from "react";

//Import components
import Canvas from "./components/canvas/Canvas";
import Sidebar from "./components/sidebar/Sidebar";
import ControlModule from "./components/control/ControlModule";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clearDrawingToggle: false,
      playToggle: false,
      pauseToggle: false,
    };
  }

  toggleClearDrawing = () => {
    this.setState({ clearDrawingToggle: !this.state.clearDrawingToggle });
  };

  togglePlay = () => {
    this.setState({ playToggle: !this.state.playToggle });
  };

  togglePause = () => {
    this.setState({ pauseToggle: !this.state.pauseToggle });
  };

  render() {
    const { clearDrawingToggle, playToggle, pauseToggle } = this.state;

    return (
      <div>
        <ControlModule
          clearDrawing={this.toggleClearDrawing}
          play={this.togglePlay}
          pause={this.togglePause}
        />
        <Canvas
          clearDrawing={clearDrawingToggle}
          play={playToggle}
          pause={pauseToggle}
        />
        <Sidebar />
      </div>
    );
  }
}
