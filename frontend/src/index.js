import React from 'react'
import ReactDOM from 'react-dom'

import * as utils from './utils.js'

import { Editor } from './editor/editor.js';

// import site-wide CSS files
import style_site_base from '../assets/css/site-base.scss';

window.props = {};
window.props.editor_id = "editor1";
window.props.editor_action = window.django.editor_action;
window.props.post_meta = {
   'thread': window.django.thread_id
};
window.props.editor_on_submit = function(event, editor) {
   event.preventDefault();

   // load up status bar input value with innerHTML of editor window
   var post_contents = document.getElementById("editor-area").getElementsByClassName("editor-window-contents")[0];

   var form_post_holder = document.forms.editor1_form.children.content;
   form_post_holder.value = encodeURIComponent(post_contents.innerHTML);

   var thread_id = encodeURIComponent(document.forms.editor1_form.children.thread.value);

   // get response from url endpoint
   fetch(window.props.editor_action, {
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
      response.json().then(function(data) {
         var post_list = document.getElementsByClassName("posts")[0];
         var num_rows = post_list.getElementsByTagName("tr").length;
         var new_post = post_list.insertRow(num_rows - 1);

         var post_info = document.createElement('th');
         var post_content = new_post.insertCell(0);

         post_content.insertAdjacentElement("beforebegin", post_info);

         post_info.classList.add("post-meta");
         post_content.classList.add("post-content");

         post_info.innerHTML = data.author ? data.author.username : "Anonymous";
         post_content.innerHTML = data.content;
      })
   })
   .then(function(response) {
      // remove selection ranges
      document.getSelection().removeAllRanges();

      // after successful post, clear editor contents
      editor.window.current.clear();
   });
};

ReactDOM.render(
   <Editor
      editor_id={window.props.editor_id}
      action={window.props.editor_action}
      post_meta={window.props.post_meta}
      on_submit={window.props.editor_on_submit}
   />,
   document.getElementById('editor-area')
);
