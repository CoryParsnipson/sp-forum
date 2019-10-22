import React from 'react'
import ReactDOM from 'react-dom'

import { Editor } from './editor/editor.js';

// ----------------------------------------------------------------------------
// External library functions
// ----------------------------------------------------------------------------
export function load_editor(editor_DOM_mountpoint, props = {}) {
   // default values
   props.editor_id     = props.hasOwnProperty('editor_id') ?     props.editor_id     : "editor1";
   props.editor_action = props.hasOwnProperty('editor_action') ? props.editor_action : "#";
   props.post          = props.hasOwnProperty('post') ?          props.post          : { 'thread': 0 };
   props.pre_submit    = props.hasOwnProperty('pre_submit') ?    props.pre_submit    : function(event, editor) {};
   props.post_submit   = props.hasOwnProperty('post_submit') ?   props.post_submit   : function(event, editor, response) {};

   ReactDOM.render(
      <Editor
         editor_id={props.editor_id}
         action={props.editor_action}
         post={props.post}
         pre_submit={props.pre_submit}
         post_submit={props.post_submit}
      />,
      document.getElementById(editor_DOM_mountpoint)
   );
};
