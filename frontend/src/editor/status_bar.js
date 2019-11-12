import React from 'react'
import ReactDOM from 'react-dom'

import * as utils from '../utils.js'

export class StatusBar extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <form
            name={this.props.editor_id}
            className={ "editor-status" + (!this.props.visible ? " hidden" : "") }
            method="post"
            action={this.props.editor_action}
            onSubmit={this.props.onSubmit}
         >
            <input type="hidden" name="csrfmiddlewaretoken" value={utils.getCookie('csrftoken')} />
            <input type="hidden" name="thread" value={this.props.post.thread} />
            <input type="hidden" name="title" value="" />
            <input type="hidden" name="content" value="" />

            <label>[Status bar contents]</label>
            <button type="submit" value="POST">POST</button>
         </form>
      );
   }
};
