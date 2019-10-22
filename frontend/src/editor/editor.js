import React from 'react'
import ReactDOM from 'react-dom'

import style_editor_base from '../../assets/css/editor-base.scss'
import style_editor_debug from '../../assets/css/editor-debug.scss'

import * as utils from './utils.js'

import { Window } from './window.js'
import { StatusBar } from './status_bar.js'

export class Editor extends React.Component {
   constructor(props) {
      super(props);

      this.window = React.createRef();

      this._submit = this._submit.bind(this)
   }

   _submit(event) {
      var editor = this;

      // customizable hook (runs before form submission)
      this.props.pre_submit(event, this);

      event.preventDefault();

      // load up status bar input value with innerHTML of editor window
      var post_contents = document.getElementById("editor-area")
         .getElementsByClassName("editor-window-contents")[0];

      var form_post_holder = document.forms.editor1_form.children.content;
      form_post_holder.value = encodeURIComponent(post_contents.innerHTML);

      var thread_id = encodeURIComponent(document.forms.editor1_form.children.thread.value);

      // get response from url endpoint
      fetch(editor.props.action, {
         credentials: 'include',
         method: 'post',
         mode: 'same-origin',
         headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-CSRFToken": utils.getCookie('csrftoken')
         },
         body: 'content=' + form_post_holder.value + "&thread=" + thread_id
      })
      .then(function(response) {
         // customizable hook (runs after submit is successful)
         editor.props.post_submit(event, editor, response);
      })
      .then(function(response) {
         // remove selection ranges
         document.getSelection().removeAllRanges();

         // after successful post, clear editor contents
         editor.window.current.clear();
      });
   }

   render() {
      return (
         <React.Fragment>
            <Window ref={this.window} />
            <StatusBar
               editor_id={this.props.editor_id}
               action={this.props.action}
               post={this.props.post}
               on_submit={this._submit}
            />
         </React.Fragment>
      );
   }
}
