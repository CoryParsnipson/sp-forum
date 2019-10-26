import React from 'react'
import ReactDOM from 'react-dom'

import style_editor_base from '../assets/css/editor-base.scss'
import style_editor_debug from '../assets/css/editor-debug.scss'

import * as utils from './utils.js';

import { Editor, EditorType } from './editor/editor.js';

// ----------------------------------------------------------------------------
// External library functions
// ----------------------------------------------------------------------------
export { utils };
export { EditorType };

export function load_editor(props = {}) {
   // default values
   props.editor_id     = props.editor_mountpoint;
   props.titlebar_id   = props.titlebar_mountpoint;
   props.editor_type   = props.editor_type ? props.editor_type : EditorType.MINIMAL;
   props.editor_action = props.hasOwnProperty('editor_action') ? props.editor_action : "#";
   props.post          = props.hasOwnProperty('post') ?          props.post          : { 'thread': 0 };
   props.pre_submit    = props.hasOwnProperty('pre_submit') ?    props.pre_submit    : function(event, editor) {};
   props.post_submit   = props.hasOwnProperty('post_submit') ?   props.post_submit   : function(event, editor, response) {};

   ReactDOM.render(
      <Editor
         editor_id={props.editor_id}
         titlebar_id={props.titlebar_id}
         editor_type={props.editor_type}
         action={props.editor_action}
         post={props.post}
         pre_submit={props.pre_submit}
         post_submit={props.post_submit}
      />,
      document.getElementById(props.editor_id)
   );
};
