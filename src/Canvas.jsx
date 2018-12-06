import React, {Component} from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Graph from './Graph';
import {modes} from "./constants";
import {sets} from "./constants";


const {NONE, X, Y, E} = sets;
var nodeKey = 0;
var edgeKey = 0;
export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      edges: [],
      selectedNodeIndex: null
    }

    this.handleClick=this.handleClick.bind(this);
    
    this.handleAddNode=this.handleAddNode.bind(this);
    this.handleMarkNode=this.handleMarkNode.bind(this);
    this.handleSelectNode=this.handleSelectNode.bind(this);
    this.handleDeleteNode=this.handleDeleteNode.bind(this);
    this.handleUpdateNodeLoc=this.handleUpdateNodeLoc.bind(this);

    this.handleDeleteEdge=this.handleDeleteEdge.bind(this);
  }

  handleClick = e => {
    // only add to a stage
    if (e.target.nodeType === 'Stage') {
      this.handleAddNode(e);
    }
  }

  handleAddNode = e => {
    var stage = e.target.getStage();
    let mousePos = stage.getPointerPosition();
    let xMousePos = mousePos.x;
    let yMousePos = mousePos.y;
    console.log("Adding node " + nodeKey + " at location: x: " + xMousePos + " y: " + yMousePos);
    let newNode = {title: "newNode", key: nodeKey++, xLoc: xMousePos, yLoc: yMousePos, set: NONE, isSelected: false};

    this.setState((prevState) => {
      return {
        nodes: [...prevState.nodes, newNode]
      }
    });
  }

  // helper to find index of a node
  findNodeIndexOfKey(key) {
    let keyPos = this.state.nodes.map(function(x) {return x.key; }).indexOf(key);
    return keyPos;
  }
  // helper to find index of a Edge
  findEdgeIndexOfKey(key) {
    let keyPos = this.state.edges.map(function(x) {return x.key; }).indexOf(key);
    return keyPos;
  }

  handleMarkNode(key) {
    console.log("Marking node key: " + key);
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes))
    //make changes to ingredients
    let index = this.findNodeIndexOfKey(key);
    
    // current set the node is in 
    let curSet = nodesCopy[index].set;
    
    if (this.props.set === X) {
      if (curSet === X) {
        console.log("Setting node " + key + " to NONE set from X");
        nodesCopy[index].set = NONE; // toggle off
      }
      else {
        console.log("Setting node " + key + " to X set from " + curSet);

        nodesCopy[index].set = X; // toggle on
      }
    }
    else if (this.props.set === Y) {
      if (curSet === Y) {
        console.log("Setting node " + key + " to NONE set from Y");
        nodesCopy[index].set = NONE; // toggle off
      }
      else {
        console.log("Setting node " + key + " to Y set from " + curSet);
        nodesCopy[index].set = Y; // toggle on
      }
    }
    else if (this.props.set === E) {
      if (curSet === E) {
        console.log("Setting node " + key + " to NONE set from E");
        nodesCopy[index].set = NONE; // toggle off
      }
      else {
        console.log("Setting node " + key + " to E set from " + curSet);
        nodesCopy[index].set = E; // toggle on
      }
    }

    this.setState({
      nodes: nodesCopy 
    });
  }

  handleSelectNode(key) {
    console.log("Selecting node key: " + key);
    let index = this.findNodeIndexOfKey(key);
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes));
    let edgesCopy = JSON.parse(JSON.stringify(this.state.edges));
    //make changes to ingredients
    this.setState((prevState) => {
      // if not selected already then select that node
      let selectedNodeIndex = prevState.selectedNodeIndex;
      if (prevState.selectedNodeIndex === null) {
        nodesCopy[index].isSelected = true;
        selectedNodeIndex = index;
      }
      // deselect if node already selected
      else if (prevState.selectedNodeIndex === index) {
        nodesCopy[index].isSelected = false;
        selectedNodeIndex = null;
      }
      // is second selected node and first node already selected
      else {
        let fromNode = nodesCopy[selectedNodeIndex];
        let toNode = nodesCopy[index];
        let newEdge = {key: edgeKey++, from: fromNode.key, to: toNode.key, xStart: fromNode.xLoc, 
          xEnd: toNode.xLoc, yStart: fromNode.yLoc, yEnd: toNode.yLoc}
        edgesCopy = [...edgesCopy, newEdge];
        console.log("Creating new edge from " + fromNode.key + " to " + toNode.key);
        console.log("Edge from: x1: " + fromNode.xLoc + " y1: " + fromNode.yLoc 
          + " x2: " + toNode.xLoc + " y2: " + toNode.yLoc);
        nodesCopy[selectedNodeIndex].isSelected = false;
        selectedNodeIndex = null;
      }
      return {
        nodes: nodesCopy,
        edges: edgesCopy,
        selectedNodeIndex: selectedNodeIndex
      };
    });
  }

  handleDeleteNode(key) {
    console.log("Removing node " + key);
    let index = this.findNodeIndexOfKey(key);

    let edgesCopy = JSON.parse(JSON.stringify(this.state.edges));
    let indicesToRemove = [];

    // remove selected state if it was selected
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes));
    this.setState((prevState) => {
      let selectedNodeIndex = prevState.selectedNodeIndex;
      if (prevState.selectedNodeIndex === index) {
        nodesCopy[index].isSelected = false;
        selectedNodeIndex = null;
      }
      return {nodes: nodesCopy, selectedNodeIndex};
    }); 

    this.deleteIncidentEdges(key, edgesCopy, indicesToRemove,
      () => {
        this.setState({

          nodes: this.state.nodes.filter((_, i) => i !== index),
          edges: edgesCopy.filter((_, i) => !indicesToRemove.includes(i))
        })
      }
    );

  }
  // helper callback to delete edges of a deleted node
  deleteIncidentEdges(nodeKey, edgesCopy, indicesToRemove, callback) {
    for (var i=0; i < edgesCopy.length; i++) {
      if (edgesCopy[i].from === nodeKey) {
        indicesToRemove.push(i);
      }
      if (edgesCopy[i].to === nodeKey) {
        indicesToRemove.push(i);
      }
    }
    callback();
  }

  handleUpdateNodeLoc(key, xLoc, yLoc) {
    console.log("Moving node " + key + " to location x: " + xLoc + " y: " + yLoc);

    let index = this.findNodeIndexOfKey(key);

    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes))
    //make changes to ingredients
    nodesCopy[index].xLoc = xLoc;
    nodesCopy[index].yLoc = yLoc;

    let edgesCopy = JSON.parse(JSON.stringify(this.state.edges));
    
    this.updateEdgeLocations(key, edgesCopy, xLoc, yLoc,
      () => {
        this.setState({
          nodes: nodesCopy,
          edges: edgesCopy
        })
      })   
  }
  // helper callback to move edges to follow nodes
  updateEdgeLocations(nodeKey, edgesCopy, xLoc, yLoc, callback) {
    for (var i=0; i < edgesCopy.length; i++) {
      if (edgesCopy[i].from === nodeKey) {
        edgesCopy[i].xStart = xLoc;
        edgesCopy[i].yStart = yLoc; 
      }
      if (edgesCopy[i].to === nodeKey) {
        edgesCopy[i].xEnd = xLoc;
        edgesCopy[i].yEnd = yLoc;
      }
    }
    callback();
  }


  handleDeleteEdge(key) {
    const {DELETE} = modes;

    let index = this.findEdgeIndexOfKey(key);

    if (this.props.mode === DELETE) {
      console.log("Deleting Edge at index " + index);
      this.setState({
        edges: this.state.edges.filter((_, i) => i !== index)
      }); 
    }
    
  }


  render() {
    const {NORMAL, ADD_EDGE, DELETE} = modes;

    if (this.props.mode === NORMAL) {
      var clickNodeFunc = this.handleMarkNode;
    }
    else if(this.props.mode === ADD_EDGE) {
      var clickNodeFunc = this.handleSelectNode;
    }
    else if(this.props.mode === DELETE) {
      var clickNodeFunc = this.handleDeleteNode;
    }


    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}

        onClick={this.handleClick}
      >

        <Graph 
          mode={this.props.mode}
          nodes={this.state.nodes}
          edges={this.state.edges}

          onClickNode={clickNodeFunc}
          onMoveNode={this.handleUpdateNodeLoc}
          onClickEdge={this.handleDeleteEdge}
        />


      </Stage>
    );
  }
}