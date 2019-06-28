import React, { Component } from 'react';
import socketio from 'socket.io-client';

const socket = socketio.connect('http://localhost:3004');

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {name: '', message: ''};
  }

  nameChanged = (e) => {
    this.setState({name: e.target.value});
  }

  messageChanged = (e) => {
    this.setState({message: e.target.value});
  }

  send = () => {
    const { name, message } = this.state;
    console.log('send', name, message);
    socket.emit('send-message', {
      name,
      message
    });

    this.setState({message: ''});
  }

  render() {
    const { name, message } = this.state;
    const { nameChanged, messageChanged, send } = this;
    return (
      <div>
        이름: <input value={name} onChange={e => nameChanged(e)} /><br />
        메세지: <input value={message} onChange={e => messageChanged(e)} />
        <button type="button" onClick={send}>전송</button>
      </div>
    )
  }
};

export default ChatForm;
