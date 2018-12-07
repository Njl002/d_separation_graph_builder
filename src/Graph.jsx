import React, {Component} from 'react';
import { Layer, Text } from 'react-konva';
import Node from "./Node";
import Edge from "./Edge";

export default class Graph extends Component {
  constructor(props) {
    super(props);

    console.log("Rerendering graph");
  }


  render() {
    const nodeLocations = this.props.nodes.map(
      (node) => (
        <Node 
          key={node.key}
          node={node.key}
          xLoc={node.xLoc}
          yLoc={node.yLoc}
          set={node.set}
          isSelected={node.isSelected}

          onClick={this.props.onClickNode}
          onUpdateLocation={this.props.onMoveNode}
        />
      )
    );
    const nodeTextLocations = this.props.nodes.map(
      (node) => (
        <Text
          font={20}
          key={node.key}
          x={node.xLoc}
          y={node.yLoc}
          text={node.key}  
        />
      )
    );
    
    
    const edgeLocations = this.props.edges.map(
      (edge) => (
        <Edge 
          key={edge.key}
          edge={edge.key}
          xStart={edge.xStart}
          xEnd={edge.xEnd}
          yStart={edge.yStart}
          yEnd={edge.yEnd}

          onClick={this.props.onClickEdge}
        />
      )
    );


    return (
      <Layer>
        {nodeLocations}
        {nodeTextLocations}
        {edgeLocations}
      </Layer>
    );
  }
}