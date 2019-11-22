import React from 'react'
import ReactDOM from 'react-dom'

import { Range, Value } from 'slate'
import Html from 'slate-html-serializer'
import { Editor as SlateEditor } from 'slate-react'

import * as utils from '../utils.js'
import { rules } from './slate-html-serializer-rules.js'
import { StatusBar } from './status_bar.js'

export class Editor extends React.Component {
   static defaultProps = {
      action: "#",
      has_status_bar: true,
      id: "",
      onChange: function ({ value }) {
         this.setState({ value: value })
      },
      onSubmitPre: function(event, editor) {},
      onSubmit: function(event, editor, response) {
         // data to send through POST
         const post_data = {
            content: JSON.stringify(editor.state.value.toJSON()),
            thread: document.forms[editor.status_bar_name()].children.thread.value,
         };

         // load up status bar input value with editor contents
         var form_post_holder = document.forms[editor.status_bar_name()].children.content;
         form_post_holder.value = encodeURIComponent(post_data.content);

         return post_data;
      },
      onSubmitPost: function(event, editor, response) {},
      placeholder: "Write something...",
      post: {
         thread: 0,
         forum: 0,
      },
      read_only: false,
      value: Value.fromJSON({
         document: {
            nodes: [
               {
                  object: 'block',
                  type: 'paragraph',
                  nodes: [
                     {
                        object: 'text',
                        text: ''
                     }
                  ],
               },
            ],
         },
      }),
   }

   constructor(props) {
      super(props);

      this.state = {
         value: this.props.value,
      }

      this.slate = React.createRef();
      this.status_bar = React.createRef();
   }

   status_bar_name = (props = this.props) => {
      const { id } = props;
      return id + "_form";
   }

   onSubmit = (event) => {
      const editor = this;

      // cancel the HTML submission page refresh
      event.preventDefault();

      Promise.resolve().then(function(response) {
         // customizable hook (runs before submit)
         return editor.props.onSubmitPre(event, editor, response);
      })
      .then(response => new Promise(
         // pass through the previous promise value to next promise
         // but wait for a small amount of time (1 DOM tick, this
         // is not a random value) to let DOM update
         resolve => setTimeout(() => resolve(response), 1)
      ))
      .then(function(response) {
         // detect Android OS
         if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            // if we're on Android, collect the content editable and deserialize it
            // to a slate value as a hack
            const html = new Html({ rules });
            const value = html.deserialize(document.getElementById(editor.props.id).firstChild.innerHTML);

            editor.state.value = value;
         }

         const post_data = editor.props.onSubmit(event, editor, response);
         const post_body = Object.keys(post_data)
            .map(key => key + '=' + encodeURIComponent(post_data[key])).join('&');

         // get response from url endpoint
         return fetch(editor.props.action, {
            credentials: 'include',
            method: 'post',
            mode: 'same-origin',
            headers: {
               "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
               "X-CSRFToken": utils.getCookie('csrftoken')
            },
            body: post_body,
         });
      })
      .then(function(response) {
         // customizable hook (runs after submit is successful)
         return editor.props.onSubmitPost(event, editor, response);
      })
      .then(function(response) {
         if (response === false) {
            return;
         }

         // detect Android OS
         if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            document.getElementById(editor.props.id).firstChild.innerHTML = "";
         }

         // after successful post, clear editor contents
         editor.slate
            .focus()
            .moveToRangeOfDocument()
            .delete()
      });
   }

   render() {
      return (
         <>
            <SlateEditor
               ref={ editor => this.slate = editor }
               onChange={ this.props.onChange.bind(this) }
               placeholder={ this.props.placeholder }
               readOnly={ this.props.read_only }
               value={ this.state.value }
            />
            <StatusBar
               ref={ sb => this.status_bar = sb }
               editor_id={ this.status_bar_name() }
               editor_action={ this.props.action }
               visible={ this.props.has_status_bar }
               post={ this.props.post }
               onSubmit={ this.onSubmit }
            />
         </>
      )
   }
}

export default {
   Editor
}
