import React, {Component} from 'react';
import Canvas from './Canvas';
import { Grid, Segment, Button, Image, Popup } from 'semantic-ui-react';
import {modes} from './constants';
import {sets} from './constants';
import SetTable from './SetTable';
import Results from './Results';
import {findDSeparatedPaths} from "./BayesNet";
import rules from "./rules.png"

const {NORMAL, ADD_EDGE, DELETE} = modes;
const {NONE, X, Y, E} = sets;
var nodeKey = 0;
var edgeKey = 0;
export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // main states
      mode : NORMAL,
      set: NONE,

      // graph states
      nodes: [],
      edges: [],
      selectedNodeIndex: null,

      // button
      buttonText: "Get Path",
      buttonLoading: false,

      //results
      results: {dseparate: [], paths: [], rules:[]},
      highlightedPath: []
    }

    this.changeModeNormal=this.changeModeNormal.bind(this);
    this.changeModeAddEdge=this.changeModeAddEdge.bind(this);
    this.changeModeDelete=this.changeModeDelete.bind(this);
    this.changeSetX=this.changeSetX.bind(this);
    this.changeSetY=this.changeSetY.bind(this);
    this.changeSetE=this.changeSetE.bind(this);

    this.handleClick=this.handleClick.bind(this);
    this.handleAddNode=this.handleAddNode.bind(this);
    this.handleMarkNode=this.handleMarkNode.bind(this);
    this.handleSelectNode=this.handleSelectNode.bind(this);
    this.handleDeleteNode=this.handleDeleteNode.bind(this);
    this.handleUpdateNodeLoc=this.handleUpdateNodeLoc.bind(this);
    this.handleDeleteEdge=this.handleDeleteEdge.bind(this);

    this.handleClickTableCell=this.handleClickTableCell.bind(this);
    
    this.handleFindResults=this.handleFindResults.bind(this);
    this.handleResultSelect=this.handleResultSelect.bind(this);
    this.handleResultDeSelect=this.handleResultDeSelect.bind(this);
  }

  
  /**  Main handler methods   **/

  changeModeNormal() {
    console.log("Change mode to Normal");
    this.setState({
      mode: NORMAL
    });
  }
  changeModeAddEdge() {
    console.log("Change mode to Add Edge");
    this.setState({
      mode: ADD_EDGE
    });
  }
  changeModeDelete() {
    console.log("Change mode to Delete");
    this.setState({
      mode: DELETE
    });
  }

  changeSetX() {
    console.log("Change set selection to X");
    this.setState({
      set: X
    });
  }
  changeSetY() {
    console.log("Change set selection to Y");
    this.setState({
      set: Y
    });
  }
  changeSetE() {
    console.log("Change set selection to E");
    this.setState({
      set: E
    });
  }

  /**  End Main handler methods   **/


  /**  Graph handler methods   **/

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
    let newNode = {title: "newNode", key: nodeKey++, xLoc: xMousePos, yLoc: yMousePos, set: NONE, isSelected: false, isHighlighted: false};

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
    
    if (this.state.set === X) {
      if (curSet === X) {
        console.log("Setting node " + key + " to NONE set from X");
        nodesCopy[index].set = NONE; // toggle off
      }
      else {
        console.log("Setting node " + key + " to X set from " + curSet);

        nodesCopy[index].set = X; // toggle on
      }
    }
    else if (this.state.set === Y) {
      if (curSet === Y) {
        console.log("Setting node " + key + " to NONE set from Y");
        nodesCopy[index].set = NONE; // toggle off
      }
      else {
        console.log("Setting node " + key + " to Y set from " + curSet);
        nodesCopy[index].set = Y; // toggle on
      }
    }
    else if (this.state.set === E) {
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

    // update button after states
    this.handleUpdateButton()
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
          xEnd: toNode.xLoc, yStart: fromNode.yLoc, yEnd: toNode.yLoc, isHighlighted: false}
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

    // update button on delete node in case needed node is deleted
    this.handleUpdateButton();
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

    if (this.state.mode === DELETE) {
      console.log("Deleting Edge at index " + index);
      this.setState({
        edges: this.state.edges.filter((_, i) => i !== index)
      }); 
    }
  }
  /**  End Graph handler methods   **/

  /** Table handler methods  **/

  handleClickTableCell(node, set) {
    console.log("Handling Clicking a Table Cell in Main");
    let prevSet = node.set;
    // case 1, clicked a selected cell, toggle OFF
    if (prevSet === set) {
      console.log("Toggle off");
      node.set = NONE;
    }
    // case 2, clicked a different cell, toggle ON specific cell
    else if(prevSet !== set) {
      console.log("Toggle on")
      node.set = set;
    }
    // update node in set
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes))
    //make changes to ingredients
    let index = this.findNodeIndexOfKey(node.key);
    nodesCopy[index] = node;
    this.setState({
      nodes: nodesCopy 
    });
    // handle update button on delete
    this.handleUpdateButton();
  }

  /** End Table handler methods **/

  // button helper
  handleUpdateButton() {
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes));
    this.findSets(nodesCopy,
      (text) => {
        console.log("Updating Button to " + text);
        this.setState({
          buttonText: text
        })
      }
    );
  }
  findSets(nodesCopy, callback) {
    let x = [];
    let y = [];
    let e = [];
    for (let i=0; i<nodesCopy.length; i++) {
      if (nodesCopy[i].set === X) {
        x.push(nodesCopy[i].key)
      }
      else if (nodesCopy[i].set === Y) {
        y.push(nodesCopy[i].key)
      }
      else if (nodesCopy[i].set === E) {
        e.push(nodesCopy[i].key)
      }
    }
    let xText = x.toString();
    let yText = y.toString();
    let eText = e.toString();
    let text = "P(" + xText + "," + yText + "|" + eText + ") ?= " + 
      "P(" + xText + "|" + eText + ") * " +
      "P(" + yText + "|" + eText + ") "
    callback(text);
  }

  /** Results handler methods **/
  handleFindResults() {
    console.log("Finding D-Separated Paths...");
  
    let results = [];
    this.updateResults(results, 
      (newResults) => {
        console.log("Paths");
        console.log(newResults);
        this.setState({results: newResults});
      }
    );
  }

  updateResults(results, callback) {
    let bayesNetObj = findDSeparatedPaths(this.state.nodes, this.state.edges);
    results = {dseparate: bayesNetObj.dseparate, paths: bayesNetObj.paths, rules: bayesNetObj.rules};
    callback(results);
  }

  // highlight path or switch highlighted path
  handleResultSelect(path) {
    console.log("Handling selecting path " + path);
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes));
    let edgesCopy = JSON.parse(JSON.stringify(this.state.edges));
    let highlight = true;

    this.updateHighlightedPath(nodesCopy, edgesCopy, path, highlight,
      () => {
        this.setState({nodes: nodesCopy, edges: edgesCopy, highlightedPath: path});
      }
    );
  }
  // unhighlight a path
  
  handleResultDeSelect(path) {
    console.log("Handling deselecting path " + path);
    let nodesCopy = JSON.parse(JSON.stringify(this.state.nodes));
    let edgesCopy = JSON.parse(JSON.stringify(this.state.edges));
    let highlight = false;

    this.updateHighlightedPath(nodesCopy, edgesCopy, path, highlight,
      () => {
        this.setState({nodes: nodesCopy, edges: edgesCopy, highlightedPath: []});
      }
    );
  }
  

  updateHighlightedPath(nodesCopy, edgesCopy, path, highlight, callback) {
    console.log("Updating the highlighted path " + path);
      // unhighlight nodes first
    for (let j=0; j<nodesCopy.length; j++) { 
      nodesCopy[j].isHighlighted = false;
    }
    // unhighlight edge first
    for (let k=0; k<edgesCopy.length; k++) {
      edgesCopy[k].isHighlighted = false;
    }
    for (let i=0; i<path.length-1;i++) {
      let firstNodeKey = path[i];
      let secondNodeKey = path[i+1];
      
 

      // search nodes for the matching key
      for (let j=0; j<nodesCopy.length; j++) {
        // highlight correct values
        if (nodesCopy[j].key === firstNodeKey || nodesCopy[j].key === secondNodeKey) {
          nodesCopy[j].isHighlighted = highlight;
        }
      }

      // search edges for matching edges
      for (let k=0; k<edgesCopy.length; k++) {
  
        // highlight correct values
        if (edgesCopy[k].to === firstNodeKey && edgesCopy[k].from === secondNodeKey) {
          edgesCopy[k].isHighlighted = highlight;
        }
        else if (edgesCopy[k].from === firstNodeKey && edgesCopy[k].to === secondNodeKey) {
          edgesCopy[k].isHighlighted = highlight;
        }
      }
    }
    callback()
  }

  /** End Results handler methods **/

  image = () => (
    <Image src={rules} size="medium" />
  );

  render() {
    return (
      <main className="App-container">

        <Segment id="header">
          <Grid columns={2}>
          <Grid.Row centered>
             <h2>D-Separation Simulation</h2>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8} floated="left" textAlign="justified">
              Select Mode
              <Button.Group color="blue">
                <Button disabled={this.state.mode === NORMAL} onClick={this.changeModeNormal}>
                  Add Node to Sets
                </Button>
                <Button disabled={this.state.mode === ADD_EDGE} onClick={this.changeModeAddEdge}>
                  Add Edges
                </Button>
                <Button disabled={this.state.mode === DELETE} onClick={this.changeModeDelete}>
                  Delete 
                </Button>         
              </Button.Group>
            </Grid.Column>           
            <Grid.Column width={8} floated="left" textAlign="justified">
              Select Set
              <Button.Group color="teal">
                <Button disabled={this.state.set === X} onClick={this.changeSetX}>
                  X
                </Button>
                <Button disabled={this.state.set === Y} onClick={this.changeSetY}>
                  Y 
                </Button>
                <Button disabled={this.state.set === E} onClick={this.changeSetE}>
                  E
                </Button>
              </Button.Group>
            </Grid.Column>

          </Grid.Row>


          <Grid.Row>
            <Grid.Column width={8} floated="left" textAlign='left'>
              Find D-Separated Paths
            <Button loading={this.state.buttonLoading} onClick={this.handleFindResults}>
              {this.state.buttonText}
            </Button>
            </Grid.Column>
            <Grid.Column width={8} floated="left" textAlign="justified">
            <Popup
              flowing
              trigger={<Button icon='picture' content='See Rules' />}
              content={<Image src={rules} size="large"/>}
              on='click'
              position='bottom left'
            />
            </Grid.Column>
          </Grid.Row>
          </Grid>
        </Segment>
        <Segment id="main-wrap">
          <Segment id="content-wrap">Canvas

            <Canvas 
              mode={this.state.mode} 

              nodes={this.state.nodes}
              edges={this.state.edges}

              onClick={this.handleClick}
              onMarkNode={this.handleMarkNode}
              onSelectNode={this.handleSelectNode}
              onDeleteNode={this.handleDeleteNode}
              onUpdateNodeLoc={this.handleUpdateNodeLoc}
              onDeleteEdge={this.handleDeleteEdge}        
            />
          </Segment>
          <div id="results">Results
            <Grid >
            <Grid.Column width={16}>
    
              <Results 
                results={this.state.results}
                nodes={this.state.node} 
                edges={this.state.edges} 

                highlightedPath={this.state.highlightedPath}
                onResultSelect={this.handleResultSelect}
                onResultDeSelect={this.handleResultDeSelect}
              />
            </Grid.Column>
            </Grid>
          </div>
          <div id="sidebar">Sets
            <Grid >
              <Grid.Column width={16}>
                <SetTable nodes={this.state.nodes} onCellClick={this.handleClickTableCell}/>
              </Grid.Column>

            </Grid>
          </div>

        </Segment>
      </main>
    );
  }
}