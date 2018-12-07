import React, {Component} from 'react';
import { Button } from 'semantic-ui-react';
import ResultPath from './ResultPath';

export default class Results extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("Rendering results");
    console.log(this.props.results);
    let dseparate = this.props.results.dseparate;
    let paths = this.props.results.paths;
    let rules = this.props.results.rules;


    const allPaths = paths.map(
      (path, i) => (
        <ResultPath 
          key={path}
          path={path}
          dseparate={dseparate}
          path={path}
          rules={rules}
          i={i}
          onSelect={this.props.onResultSelect}
          onDeSelect={this.props.onResultDeSelect}
          highlightedPath={this.props.highlightedPath}
        />
      ) 
    );

    return (
      <Button.Group vertical>
        {allPaths}
      </Button.Group>
    );
  }

}