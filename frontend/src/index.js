import React from 'react'
import ReactDOM from 'react-dom'

import * as utils from './utils.js'

import { Editor } from './editor/editor.js';

window.props = {};
window.props.editor_id = "editor1";
window.props.editor_action = window.django.editor_action;
window.props.editor_on_submit = function(event) {
   event.preventDefault();

   // load up status bar input value with innerHTML of editor window
   var post_contents = document.getElementById("editor-area").getElementsByClassName("editor-window-contents")[0];

   var form_post_holder = document.forms.editor1_form.children.post_contents;
   form_post_holder.value = encodeURIComponent(post_contents.innerHTML);

   // get response from url endpoint
   fetch(window.props.editor_action, {
      credentials: 'include',
      method: 'post',
      mode: 'same-origin',
      headers: {
         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
         "X-CSRFToken": utils.getCookie('csrftoken')
      },
      body: 'post_contents=' + form_post_holder.value
   })
      .then(function(response) {
         response.json().then(function(data) {
            console.log(data);
            window.alert(data.contents);
         });
      });
};

ReactDOM.render(
   <Editor
      editor_id={window.props.editor_id}
      action={window.props.editor_action}
      on_submit={window.props.editor_on_submit}
   />,
   document.getElementById('editor-area')
);
