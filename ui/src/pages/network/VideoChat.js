import React from 'react';
import LioWebRtc from "liowebrtc";

import {Badge, Button} from "react-bootstrap";
import endCallIcon from "./end-call-icon.png";
import callIcon from "./phone-call.png";
import webrtc from 'liowebrtc/dist/webrtc';


/**
 * VideoChat - WebRTC Workshop: will contain all the logic to start video chat with peer
 */
class VideoChat extends React.Component {
  constructor(props) {
    // TODO: set logged in user state, room id, flag if call in progress, and video configuration

    super(props);
    this.state = {
      nick: props.currentUser ? props.currentUser.firstName : null,
      roomID: `tumochat${[props.caller.email, props.receiver.email].sort().join()}`,
      muted: true,
      camPaused: false,
      peers: [],
      inCall: false, 
    }

    this.videoRef = React.createRef();
    this.remoteVideos = {};
  }
  componentDidMount() {
      this.webrtc = new LioWebRtc({
        url: "https://sm1.lio.app:443/",
        localVideoEl: this.localVideo,
        autoRequestMedia: false,
        nick: this.props.currentUser.email,
        debug: true,
        localVideo: {
          mirror: false,
          muted: true,
        },

        stunservers: ['stun.l.google.com:19302', 'stun1.l.google.com:19302', 'stun2.l.google.com:19302'],
        turnservers: ['ec2-54-214-226-181.us-west-2.compute.amazonaws.com'],
      })

      this.webrtc.on("peerStreamAdded", this.addVideo);
      this.webrtc.on("remowedPeer", this.remowedPeer);
      this.webrtc.on("iceFailed", this.handleConnectionError);
      this.webrtc.on("connectivityError", this.handleConnectionError);


  }
  componentWillUnmount() {
    this.disconnect();
  }

  disconnect = () => {
    this.webrtc.quit();
  }

  addVideo = (stream, peer) => {
    this.setState({ peers: [...this.state.peers, peer] } , () => {
      this.webrtc.attachStream(stream, this.remoteVideos[peer.id], {mirror: false});
      this.setState({inCall: true});
    })
  }

  remowedPeer = (peer) => {
    this.setState({peers: this.state.peers.filter(p => !p.closed)})
  } 

  handleConnectionError = (peer) => {
    const pc = peer.pc;

    console.log('had local relay candidate', pc.hadLocalRelayCandidate);
    console.log('had remote relay candidate', pc.hadRemoteRelayCandidate);

  }

  startCall() {
    this.webrtc.startLocalVideo();
    this.readyToJoin();
  }

  stopCall() {
    this.webrtc.leaveRoom();
    this.setState({inCall: false});
  }

  readyToJoin() {
    this.webrtc.joinRoom(this.state.roomID, (err, desc) => {})
  }

  generateRemotes = () => this.state.peers.map((p) => (
    <div key={p.id}>
      <div
        id={`${this.webrtc.getContainerId(p)}`}>
        <video
          controls
          autoPlay
          id={this.webrtc.getDomId(p)}
          ref={(v) => this.remoteVideos[p.id] = v}
          style={{width: "100%", transform: "none"}}
          />
      </div>
      <div style={{position: "absolute", top: "0", left: "0", padding: "10px"}}>
        <Badge variant="info">{p.nick}</Badge>
      </div>
    </div>
    ));

  render() {
    return (
      <div>
        {this.generateRemotes()}
        <div className="d-flex justify-content-center align-items-center">
          <video controls width={this.state.inCall ? "50%" : "100%"} height="auto" autoPlay ref={(vid) => { this.localVideo = vid; }}></video>
          <div style={{position: "absolute", padding: "5px", alignSelf: "baseline"}}>
            <Badge variant="info">{this.props.currentUser.firstName}</Badge>
          </div>
          <div className="position-absolute">
            <Button disabled={this.state.inCall ? true : null} variant="link" onClick={() => {this.startCall()}}><img width="45px" src={callIcon} alt="call" /></Button>
            <Button disabled={this.state.inCall ? null : true} variant="link" onClick={() => {this.stopCall()}}><img width="45px" src={endCallIcon} alt="endcall" /></Button>
          </div>
        </div>
      </div>
    )
  }
}

export default VideoChat;
