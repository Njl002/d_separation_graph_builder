import React, {Component} from "react";
import { Table } from 'semantic-ui-react';
import SetRow from "./SetRow";

export default class SetTable extends Component {
  constructor(props) {
    super(props);
    this.handleClickCell=this.handleClickCell.bind(this);
  }

  handleClickCell(node, set) {
    this.props.onCellClick(node, set);
  }
  
  render() {

    const nodeTable = this.props.nodes.map(
      (node) => (
        <SetRow key={node.key} node={node} onClick={this.handleClickCell}/>
      )
    );

    return (
      <Table celled structured>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan='1'>Node</Table.HeaderCell>
          <Table.HeaderCell rowSpan='1'>X</Table.HeaderCell>
          <Table.HeaderCell rowSpan='1'>Y</Table.HeaderCell>
          <Table.HeaderCell rowSpan='1'>E</Table.HeaderCell>
        </Table.Row>

      </Table.Header>
  
      <Table.Body>
        {nodeTable}
      </Table.Body>
    </Table>

    );
  }

}