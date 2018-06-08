import * as React from 'react';
import Article from './article'
export interface AppProps { 
  activity_id: string
}

export default class AppComponent extends React.Component<AppProps, any> {
  render() {
    return (
      <div className="container">
        <Article activity_id={parseInt(this.props.activity_id)} />
      </div>
    );
  }
}