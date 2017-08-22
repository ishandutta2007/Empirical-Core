import * as React from 'react'

class Script extends React.Component<any, any> {
  constructor(props){
    super(props);
  }

  renderScriptItems(): Array<JSX.Element> {
    return Object.keys(this.props.script).map((scriptItem) => {
      const item = this.props.script[scriptItem]
      return (
        <li style={styles.box} key={scriptItem}>
          {item.type} {item.data ? item.data.heading : ''}
          <a href={`/#/admin/classroom-lessons/${this.props.lesson}/slide/${this.props.slide}/scriptItem/${scriptItem}`}> edit</a>
        </li>
      );
    })
  }

  render() {
    return (
      <ul>
        {this.renderScriptItems()}
      </ul>
    )
  }

}

export default Script

const styles = {
  box: {
    marginBottom: 5,
    padding: 5,
    border: '1px #3d3d3d solid',
    borderRadius: 3
  }
}
