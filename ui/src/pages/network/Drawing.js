import React from 'react';
import {Button} from "react-bootstrap";

import Socket from '../../socket';
import {LinkContainer} from "react-router-bootstrap"

/**
 * Component use for canvas drawing with peer
 */
class Drawing extends React.Component {
  constructor(props) {
    super(props);

    this.isPainting = false;
    this.userStrokeStyle = 'black';
    this.guestStrokeStyle = 'red';
    this.line = [];
    this.prevPos = { offsetX: 0, offsetY: 0 };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY} = nativeEvent;

    this.isPainting = true;
    this.prevPos = {offsetX, offsetY};
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const {offsetX, offsetY} = nativeEvent;
      const offsetData = { offsetX,  offsetY};
      const positionData = {
        start: {...this.prevPos},
        stop: {...offsetData},
      }

      this.line = this.line.concat(positionData)
      this.paint(this.prevPos, offsetData, this.userStrokeStyle);
    }
  }
  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.sendPaintData();
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const {offsetX, offsetY} = currPos;
    const {offsetX: x, offsetY: y} = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;

    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = {offsetX, offsetY};

  }
  sendPaintData() {
    Socket.users.emit("drawing-message", this.props.withUser, this.props.currentUser, this.line);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.line = [];
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.linewidth = 5;

    this.canvas.width = this.container.parentElement.parentElement.offsetWidth;
    // window.addEventListener("resize", () => {
    //   this.canvas.width = this.container.offsetWidth;
    // })

    Socket.connect(users => {
      users.on("drawing-message", (fromUser, line) => {
        if (Array.isArray(line) && line.height === 0) {
          this.clear();
        }
        line.forEach((position) => {
          this.paint(position.start, position.stop, this.guestStrokeStyle);
        })
      })
    })
  }
  render() {
    return (
      <div ref={el => this.container = el} style={{height: "500px", border: "1px solid black"}}>
        <Button 
          variant="info" 
          onClick={() => {this.clear(); this.sendPaintData()}}
          style={{position: "realtive", zIndex: 100}}
          >Clear</Button>
        <canvas
          ref={(ref) => (this.canvas = ref)}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}

          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          id="canvas" width="100px" height="500px"
        ></canvas>
      </div>
    )
  }
}

export default Drawing;
