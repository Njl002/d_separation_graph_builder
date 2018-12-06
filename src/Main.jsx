import React, {Component} from 'react';
import Canvas from './Canvas';
import { Grid, Segment, Button } from 'semantic-ui-react';
import {modes} from "./constants";
import {sets} from "./constants";

const {NORMAL, ADD_EDGE, DELETE} = modes;
const {NONE, X, Y, E} = sets;
export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode : NORMAL,
      set: NONE
    }

    this.changeModeNormal=this.changeModeNormal.bind(this);
    this.changeModeAddEdge=this.changeModeAddEdge.bind(this);
    this.changeModeDelete=this.changeModeDelete.bind(this);
    this.changeSetX=this.changeSetX.bind(this);
    this.changeSetY=this.changeSetY.bind(this);
    this.changeSetE=this.changeSetE.bind(this);
  }

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

  render() {
    return (
      <main className="App-container">
        <Segment id="header">Header
          <Grid centered>
          
          <Grid.Row>
          <Button.Group color="blue">
            <Button disabled={this.state.mode === NORMAL} onClick={this.changeModeNormal}>
              Add Nodes
            </Button>
            <Button disabled={this.state.mode === ADD_EDGE} onClick={this.changeModeAddEdge}>
              Add Edges
            </Button>
            <Button disabled={this.state.mode === DELETE} onClick={this.changeModeDelete}>
              Delete 
            </Button>
          </Button.Group>
          </Grid.Row>
          <Grid.Row>
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
          </Grid.Row>
          </Grid>
        </Segment>
        <Segment id="main-wrap">
          <div id="content-wrap">Content

            <Canvas mode={this.state.mode} set={this.state.set}/>
          </div>
          <div id="sidebar">Info
            
          </div>
        </Segment>
      </main>
    );
  }
}