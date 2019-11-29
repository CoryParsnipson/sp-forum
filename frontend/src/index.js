import React from 'react'
import ReactDOM from 'react-dom'

import { Value } from 'slate'
import Html from 'slate-html-serializer'
import Plain from 'slate-plain-serializer'

// import site-wide CSS files
import style_editor_base from '../assets/css/editor-base.scss'
import style_editor_debug from '../assets/css/editor-debug.scss'
import style_site_base from '../assets/css/site-base.scss';

import * as utils from './utils.js';
import { rules } from './editor/slate-html-serializer-rules.js';
import { Editor } from './editor/editor.js';

// ----------------------------------------------------------------------------
// External library functions
// ----------------------------------------------------------------------------
export { utils };
export { Html, rules };

export function load_editor(props) {
   return ReactDOM.render(<Editor {...props} />, document.getElementById(props.id));
};

export function deserialize_slate_content() {
   // need to do the "[].slice.call" to convert this to a static array (because
   // getElementsByClassName returns a dynamic list that changes everytime you
   // update the DOM)
   const rich_contents = [].slice.call(document.getElementsByClassName("format_rich"));
   const plain_contents = [].slice.call(document.getElementsByClassName("format_plain"));
   const html = new Html({ rules })

   function mountEditor(mount_el, test = null) {
      const props = {
         id: 'temp-editor',
         placeholder: "[ Empty Post ]",
         read_only: true,
      };

      const editor_el = document.createElement('div');
      mount_el.appendChild(editor_el);

      return ReactDOM.render(<Editor {...props} />, editor_el);
   }

   function unmountEditor(mount_el) {
      // I don't know enough javascript to figure out how to return a reference
      // to "editor_el" variable from mountEditor(), so just hardcode the
      // same DOM query here for now...
      mount_el.removeChild(mount_el.childNodes[mount_el.childNodes.length - 1]);
   }

   function format_contents(editor, contents, is_rich = false) {
      for (const el of contents) {
         try {
            editor.state.value = Value.fromJSON(JSON.parse(el.innerText));
         } catch(err) {
            if (err instanceof SyntaxError) {
               editor.state.value = Plain.deserialize(el.innerText);
               is_rich = false;
            }
         }

         var formatted = document.createElement('div');
         if (is_rich) {
            formatted.innerHTML = html.serialize(editor.state.value);
         } else {
            formatted.innerHTML = Plain.serialize(editor.state.value);
         }

         if (!formatted.innerText) {
            formatted.innerText = "[ Empty Post ]";
         }

         let num_children = formatted.childNodes.length;
         while (num_children > 0) {
            el.parentNode.appendChild(formatted.childNodes[0]);
            --num_children;
         }
         el.parentNode.removeChild(el);
      }
   }

   const editor = mountEditor(document.getElementsByClassName("footer")[0]);

   format_contents(editor, rich_contents, true);
   format_contents(editor, plain_contents, false);

   // deserialize title tag
   const title = document.title.replace("SP Forum :: ", "");
   const title_el = document.createElement('div');
   title_el.innerHTML = "<span>" + title + "</span>";

   format_contents(editor, [ title_el.childNodes[0] ], false);

   if (title_el.innerText.length > 200) {
      title_el.innerText = title_el.innerText.substring(0, 20) + "...";
   }
   document.title = "SP Forum :: " + title_el.innerText;

   unmountEditor(document.getElementsByClassName("footer")[0]);
}

