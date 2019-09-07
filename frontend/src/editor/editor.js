import React from 'react'
import ReactDOM from 'react-dom'

import '../../assets/css/editor-base.css'

import { Window } from './window.js'
import { StatusBar } from './status_bar.js'

export class Editor extends React.Component {
   constructor(props) {
      super(props);

      this.window = React.createRef();
   }

   render() {
      return (
         <React.Fragment>
            { this.props.header ? (<h1>{this.props.header}</h1>) : (<h1>New Post</h1>) }
            <Window ref={this.window} />
            <StatusBar
               editor_id={this.props.editor_id}
               action={this.props.action}
               post_meta={this.props.post_meta}
               on_submit={(event) => { this.props.on_submit(event, this) }}
            />
         </React.Fragment>
      );
   }
}
