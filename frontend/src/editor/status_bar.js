import React from 'react'
import ReactDOM from 'react-dom'

import * as utils from './utils.js'
import { EditorType } from './editor.js'

export class StatusBar extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <form
            name={this.props.editor_id + "_form"}
            className="editor-status"
            method="post"
            action={this.props.action}
            onSubmit={this.props.on_submit}
         >
            <input type="hidden" name="csrfmiddlewaretoken" value={utils.getCookie('csrftoken')} />
            <input type="hidden" name="thread" value={this.props.post.thread} />
            {this.props.editor_type == EditorType.FULL ? <input type="hidden" name="title" value="" /> : null}
            <input type="hidden" name="content" value="" />

            <button type="submit" value="POST">POST</button>
         </form>
      );
   }
};
