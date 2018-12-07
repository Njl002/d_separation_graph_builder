import React, {Component} from 'react';
import { Button } from 'semantic-ui-react';

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }

  handleClick() {

    if (this.props.highlightedPath === this.props.path) {
      console.log("Deselecting path " + this.props.path);
      this.props.onDeSelect(this.props.path);
    }
    else if (this.props.highlightedPath !== this.props.path) {
      console.log("Selecting path " + this.props.path);
      // need to deselect old path
      this.props.onSelect(this.props.path);
    }

  }


  render() {
    let isSelected = this.props.highlightedPath === this.props.path;
    return (
      <Button color={isSelected ? "green" : "blue"} fluid onClick={this.handleClick}>
      {"Path: " + this.props.path.toString() + " is " + 
       (this.props.dseparate[this.props.i] ? ("d-separated by rule(s): " + this.props.rules[this.props.i])
         : "not d-separated")
     }
     </Button>
    );
  }

}