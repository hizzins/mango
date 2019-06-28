import React, { Component } from 'react';
import './VideoRemoteChat.scss';
import socketio from 'socket.io-client';
import moment from "../../ChatControl/ChatControl";

const socket = socketio.connect('http://localhost:3004');

class VideoRemoteChat extends Component {
  constructor(props) {
    super(props);
    this.remoteStream = null;
  }

  RTCPreerConnection () {
    const { player } = this;
    const remotePeer = new RTCPeerConnection(null);

    remotePeer.onaddstream = (e) => {
      player.src = URL.createObjectURL(e.stream);
    };
  }

  // for older browsers
  getMediaDevicesForOlder() {
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // prefixed
        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
  }



  componentDidMount() {
    const constraints = {'video': true, 'audio': false};
    const { player, getMediaDevicesForOlder } = this;

    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //
    // navigator.getUserMedia(constraints,
    //   function(stream) {
    //     player.srcObject = stream;
    //   },
    //   function(error) {
    //     console.log('error', error);
    // });

    getMediaDevicesForOlder();

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      player.srcObject = stream;
      player.onloadedmetadata = function(e) {
        console.log('+++onloadedmetadata', e);
        player.play();
      };
    }).catch((error) => {
      console.log(error.name + ':' + error.message);
    });
  }


  render() {
    const { handleCapture } = this;
    console.log('render');
    return (
      <div id="web-chat">
        <div>
          <video id="player" autoPlay ref={ref => this.player = ref} />
        </div>
      </div>
    );
  }
}

export default VideoRemoteChat;
