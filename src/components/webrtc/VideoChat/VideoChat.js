import React, { Component } from 'react';
import './VideoChat.scss';
import socketio from 'socket.io-client';
import moment from 'moment';

const socket = socketio.connect('http://localhost:3004');

class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.localPeer = null;
    this.remotePeer = null;
    this.peerID = moment().valueOf();

    const mediaServer = {
      address: 'stcoturn1.remotemeeting.com',
      port: 5349,
      id: 'st-coturn',
      pw: 'vNjy8X/ICveQkx9644g7RJ4vskM='
    };

    // this.configuration = {
    //   iceServers: [
    //     {
    //       'urls': [
    //         'stun:' + mediaServer.address + ':' + mediaServer.port
    //       ]
    //     },
    //     {
    //       'urls': [
    //         'turn:' + mediaServer.address + ':' + mediaServer.port + '?transport=udp',
    //         'turn:' + mediaServer.address + ':' + mediaServer.port + '?transport=tcp'
    //       ],
    //       'username': mediaServer.id,
    //       'credential': mediaServer.pw
    //     }
    //   ]
    // };

    this.configuration = { iceServers: [
      {
          urls: 'stun:stun.services.mozilla.com',
          username: "louis@mozilla.com",
          credential: "webrtcdemo"
      },
      {
        urls: [
          'stun.l.google.com:19302',
          'stun1.l.google.com:19302 ',
          'stun2.l.google.com:19302',
          'stun3.l.google.com:19302',
          'stun4.l.google.com:19302',
          'stun.stunprotocol.org:3478'
        ]
      }
    ]};

    // this.configuration = { iceServers: [
    //       {
    //           urls: 'stun:numb.viagenie.ca:3489',
    //           username: "hizzin413@gmail.com",
    //           credential: "heejin111"
    //       }
    //     ]};
  }

  RTCPeerConnection = (stream) => {
    const { localPeer, localPlayer, remotePlayer, createOffer, configuration, sendData, peerID } =  this;
    this.localPeer = new RTCPeerConnection(configuration);
    const localBuffer = [];
    let iceCandidate = null;
    let newIceCandidate = null;


    console.trace('Created local peer connection object pc1', localPeer);
    // 로컬 스트림 저장
    localPeer.onaddstream = (e) => {
      console.log('+++onaddstream', e);
      // 콜러한테 받은 스트림 e.stream
      remotePlayer.src = URL.createObjectURL(e.stream);
    };
    localPeer.addStream(stream);
    createOffer();
    localPeer.onicecandidate = (e) => {
      console.log('++onicecandidate local', e, e.candidate);
      iceCandidate = e.candidate;

      if (iceCandidate) {
        newIceCandidate = new RTCIceCandidate(iceCandidate);
      }
      sendData({id: peerID, type: 'candidate', candidate: newIceCandidate});
    }

    // addIceCandidateRemote(newIceCandidate);
  }

  RTCPeerConnectionRemote = () => {
    this.remotePeer = new RTCPeerConnection(null);
    const { remoteplayer, remotePeer, addIceCandidateLocal } =  this;

    let iceCandidate = null;
    let newIceCandidate = null;

    // remotePeer.onicecandidate = (e) => {
    //   console.log('++onicecandidate remote', e);
    //   iceCandidate = e.candidate;
    //
    //   if (iceCandidate) {
    //     newIceCandidate = new RTCIceCandidate(iceCandidate);
    //   }
    // }

    remotePeer.onaddstream = (e) => {
      console.log('+++onaddstream', e);
      // 콜러한테 받은 스트림 e.stream
      remoteplayer.src = URL.createObjectURL(e.stream);
    };

  }

  addIceCandidateRemote = (newIceCandidate) => {
    const { remotePeer } =  this;
    remotePeer.addIceCandidate(newIceCandidate);
  }

  addIceCandidateLocal = (newIceCandidate) => {
    const { localPeer } =  this;
    localPeer.addIceCandidate(newIceCandidate);
  }

  createOffer = () => {
    const { localPeer, remotePeer, createAnswer, sendData, peerID } = this;
    console.log('+++createOffer');
    localPeer.createOffer().then((sdp) => {
      console.log('success create offer', sdp);
      localPeer.setLocalDescription(sdp);
      sendData({id: peerID, type: 'sendOffer', sdp});
      // sendOffer
      // remotePeer.setRemoteDescription(sdp);
      // createAnswer();
    }).catch( (error) => {
      console.log('error create offer', error);
    });
  }

  createAnswer = () => {
    const { localPeer, sendData } = this;

    localPeer.createAnswer().then((sdp) => {
      console.log('createAnswerSuccess');
      localPeer.setLocalDescription(sdp);
      sendData({from: peerID, type: 'sendAnswer', sdp});
    }).catch((error) => {
      console.log('createAnswerError', error);
    });
  }

  sendData = (msg) => {
    socket.emit('send-message', msg);
  }

  recieveData = () => {
    const { peerID, addIceCandidateLocal, localPeer, createAnswer } = this;

    socket.on('recieve-message', (msg) => {
      console.log('recieve-message', msg, localPeer);
      const { from, type } = msg;

      if (from !== peerID) {
        switch(type) {
          case 'sendOffer':
            localPeer.setRemoteDescription(msg.sdp);
            createAnswer();
            break;
          case 'sendAnswer':
            localPeer.setRemoteDescription(msg.sdp);
            break;
          case 'candidate' :
            addIceCandidateLocal(msg.candidate);
            break;
        }
      }
    });
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
    const { localPlayer, getMediaDevicesForOlder, RTCPeerConnection, RTCPeerConnectionRemote, recieveData } = this;

    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //
    // navigator.getUserMedia(constraints,
    //   function(stream) {
    //     localPlayer.srcObject = stream;
    //   },
    //   function(error) {
    //     console.log('error', error);
    // });

    getMediaDevicesForOlder();

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localPlayer.srcObject = stream;
      localPlayer.onloadedmetadata = function(e) {
        RTCPeerConnection(stream);
        recieveData();
        // RTCPeerConnectionRemote(stream);
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
          <video id="local-player" autoPlay muted ref={ref => this.localPlayer = ref} />
          <video id="remote-player" autoPlay ref={ref => this.remotePlayer = ref} />
          <button id="hangup-button" disabled>Hang Up</button>
        </div>
      </div>
    );
  }
}

export default VideoChat;
