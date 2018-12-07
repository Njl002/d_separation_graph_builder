import React, {Component} from 'react';
import { Stage } from 'react-konva';
import Graph from './Graph';
import {modes} from "./constants";


export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 1000
    };
    this.checkSize=this.checkSize.bind(this);
  }

  componentDidMount() {
    this.checkSize();
    // here we should add listener for "container" resize
    // take a look here https://developers.google.com/web/updates/2016/10/resizeobserver
    // for simplicity I will just listen window resize
    window.addEventListener("resize", this.checkSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    const width = this.container.offsetWidth;
    this.setState({
      stageWidth: width
    });
  };

  render() {
    const {NORMAL, ADD_EDGE, DELETE} = modes;

    if (this.props.mode === NORMAL) {
      var clickNodeFunc = this.props.onMarkNode;
    }
    else if(this.props.mode === ADD_EDGE) {
      var clickNodeFunc = this.props.onSelectNode;
    }
    else if(this.props.mode === DELETE) {
      var clickNodeFunc = this.props.onDeleteNode;
    }


    return (
       <div
        style={{
          width: "100%"
        }}
        ref={node => {
          this.container = node;
        }}
      >

      <Stage width={this.state.stageWidth} height={window.innerHeight}

        onClick={this.props.onClick}
      >

        <Graph 
          mode={this.props.mode}
          nodes={this.props.nodes}
          edges={this.props.edges}

          onClickNode={clickNodeFunc}
          onMoveNode={this.props.onUpdateNodeLoc}
          onClickEdge={this.props.onDeleteEdge}
        />


      </Stage>
      </div>
      
    );
  }
}