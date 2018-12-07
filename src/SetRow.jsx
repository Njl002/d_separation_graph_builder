import React, {Component} from "react";
import { Table, Icon } from 'semantic-ui-react';
import {sets} from './constants';


const {X, Y, E} = sets;
export default class SetRow extends Component {
  constructor(props) {
    super(props);

    this.handleOnClickCellX=this.handleOnClickCellX.bind(this);
    this.handleOnClickCellY=this.handleOnClickCellY.bind(this);
    this.handleOnClickCellE=this.handleOnClickCellE.bind(this);
  }

  arrowIcon = () => (
    <Icon color='green' name='checkmark' size='large' /> 
  );

  handleOnClickCellX() {
    console.log("Clicked cell X of node " + this.props.node.key);
    this.props.onClick(this.props.node, X);
  }
  handleOnClickCellY() {
    console.log("Clicked cell Y of node " + this.props.node.key);
    this.props.onClick(this.props.node, Y);
  }
  handleOnClickCellE() {
    console.log("Clicked cell E of node " + this.props.node.key);
    this.props.onClick(this.props.node, E);
  }

  render() {
    const {X, Y, E} = sets;

    return (
      <Table.Row>
        <Table.Cell textAlign='center'>
          {this.props.node.key}
        </Table.Cell>
        <Table.Cell  textAlign='center' onClick={this.handleOnClickCellX}>
          {this.props.node.set === X && <Icon color='green' name='checkmark' size='small'/>}
        </Table.Cell>
        <Table.Cell textAlign='center' onClick={this.handleOnClickCellY}>
          {this.props.node.set === Y && <Icon color='green' name='checkmark' size='small'/>}
        </Table.Cell>
        <Table.Cell textAlign='center' onClick={this.handleOnClickCellE}>
          {this.props.node.set === E && <Icon color='green' name='checkmark' size='small'/>}
        </Table.Cell>
      </Table.Row>
    );
  }

}