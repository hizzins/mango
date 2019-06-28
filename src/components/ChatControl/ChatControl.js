import React, { Component } from 'react';
import socketio from 'socket.io-client';
import moment from 'moment';

const socket = socketio.connect('http://localhost:3004');

class ChatControl extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [] };
  }

  bindRecieve = () => {
    socket.on('recieve-message', (obj) => {
      console.log('recieve-message', obj);
      const newLogs = this.state.logs;
      obj.key = moment().valueOf();
      newLogs.unshift(obj);
      this.setState({ logs: newLogs});
    });
  }

  componentDidMount() {
    this.bindRecieve();
  }

  render() {
    const { logs } = this.state;
    return (
      <div>
        <h2>채팅내용</h2>
        {
          logs && logs.map((item, i) => {
            return (
              <div key={i}>
                <p>{item.name} : {item.message}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
};

export default ChatControl;
