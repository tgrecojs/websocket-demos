import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const DisplayPastTemps = ({temps}) => temps.length < 1 ? <p>No temperature to display</p> :
  temps.map((x, i) => 
  <div key={i}>Temperature #{i + 1}: {x}</div>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:3000",
      pastTemps: []
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data, pastTemps: this.state.pastTemps.concat(data) }));
  }
  render() {
    const { response } = this.state;
    return (
        <div style={{ textAlign: "center" }}>
          {response
              ? <p>
                The temperature in Florence is: {response} °F
              </p>
              : <p>Loading...</p>}
          <DisplayPastTemps temps={this.state.pastTemps} />
        </div>
    );
  }
}
export default App;