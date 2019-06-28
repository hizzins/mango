import React, { Component } from 'react';
import './WebCamera.scss';

class WebCamera extends Component {
  constructor(props) {
    super(props);
    this.videoTracks = null;
  }

  handleCapture = () => {
    var context = this.snapshotCanvas.getContext('2d');
    context.drawImage(this.player, 0, 0, this.snapshotCanvas.width, this.snapshotCanvas.height);
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({'video': true}).then((stream) => {
      this.player.srcObject = stream;
      this.videoTracks = stream.getVideoTracks();
    });
  }

  componentWillUnmount() {
    this.videoTracks.forEach((track) => { track.stop(); });
  }


  render() {
    const { handleCapture } = this;
    console.log('render');
    return (
      <div id="web-chat">
        <div>
          <video id="player" autoPlay ref={ref => this.player = ref} />
        </div>
        <button className="button primary round" onClick={handleCapture}>사진 찍기</button>
        <div className="wrap-pohto-area">
          <canvas width="320" height="240" ref={ref => this.snapshotCanvas= ref} />
        </div>
      </div>
    );
  }
}

export default WebCamera;
