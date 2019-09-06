import React from 'react'
import ReactDOM from 'react-dom'

import '../../assets/css/editor-base.css'
import '../../assets/css/editor-debug.css'

import { Paragraph } from './paragraph.js'
import { Cursor } from './cursor.js'

export class Window extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         has_focus: false,
         debug: false,
         next_content_id: 0,
         cursor: {
            needs_update: true,
            pos: [0, 0], // contents idx, character offset
            coord: [0, 0], // pixel coordinates of cursor
            selection_start: 0,
            selection_end: 0,
            visible: true,
         },
         contents: [],
         inputs: {}
      };

      // initialize keys that we are keeping track of
      this.state.inputs.escape = false;

      // initialize with one empty paragraph
      this.state.contents.push(this.create_paragraph());
      ++this.state.next_content_id;

      this.p_refs = {};
      this.p_refs[this.state.contents.length - 1] = React.createRef();

      this.editor_win = React.createRef();
      this.cursor = React.createRef();

      this.clear = this.clear.bind(this);

      this.add_paragraph = this.add_paragraph.bind(this);
      this.remove_paragraph = this.remove_paragraph.bind(this);

      this.cursor_show = this.cursor_show.bind(this);
      this.cursor_hide = this.cursor_hide.bind(this);
      this.cursor_set_pos = this.cursor_set_pos.bind(this);

      this._onBlur = this._onBlur.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onKeyUp = this._onKeyUp.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
   }

   clear() {
      // remove all contents
      for (const [index, tag] of this.state.contents.entries()) {
         this.remove_paragraph(index);
      }
      this.add_paragraph();

      // reset the cursor
      this.cursor_set_pos(0, 0);
   }

   componentDidMount() {
      // this causes the editor window to steal focus upon page load
      this.editor_win.current.focus();

      // initialize cursor position (to be at the front of the first paragraph)
      this.cursor_set_pos(0, 0);
   }

   componentDidUpdate() {
      if (this.state.cursor.needs_update) {
         const cursor = this.state.cursor;

         cursor.needs_update = false;
         cursor.coord = this.cursor_update();

         this.setState({
            cursor: cursor
         });
      }
   }

   _onBlur() {
      this.setState({
         has_focus: false,
      });
   }

   _onFocus() {
      this.setState({
         has_focus: true,
      });
   }

   _onKeyUp(event) {
      if (event.keyCode === 27) {
         const inputs = this.state.inputs;
         inputs.escape = false;

         this.setState(inputs);
      }
   }

   _onKeyDown(event) {
      const alphanum = ' abcdefghijklmnopqrstuvwxyz0123456789,.?!~`@#$%^&*()\'"-_=+|';
      const new_cursor = this.state.cursor;
      const paragraph_idx = new_cursor.pos[0];

      // track escape key for chording
      if (event.keyCode === 27 && !this.state.inputs.escape) {
         const inputs = this.state.inputs;
         inputs.escape = true;

         this.setState({ inputs: inputs });
      }

      // ESC+D is pressed
      // TODO: probably want to add a button and a more intuitive keyboard shortcut here instead
      if (event.keyCode === 68 && this.state.inputs.escape) {
         const cursor = this.state.cursor;
         cursor.needs_update = true;

         this.setState({
            debug: !this.state.debug,
            cursor: cursor
         });
         return;
      }

      if (event.keyCode === 32) {
         event.preventDefault();
      }

      if (alphanum.indexOf(event.key.toLowerCase()) !== -1) {
         const curr_paragraph = this.state.contents[paragraph_idx];

         const new_char = (
            (curr_paragraph.text[new_cursor.pos[1] - 1] === ' '
            || curr_paragraph.text[new_cursor.pos[1] - 1] === '\u00A0')
            && event.keyCode == 32 ?
            '\u00A0' : event.key
         );

         const new_contents = this.state.contents;
         new_contents[paragraph_idx].text =
            new_contents[paragraph_idx].text.slice(0, new_cursor.pos[1]) +
            new_char +
            new_contents[paragraph_idx].text.slice(new_cursor.pos[1]);

         this.setState({ contents: new_contents });

         ++new_cursor.pos[1]
      }

      if (event.key === 'Enter') {
         // get the portion of the paragraph that's after the cursor
         const new_p = this.state.contents[new_cursor.pos[0]].text.slice(new_cursor.pos[1]);

         const new_contents = this.state.contents;
         new_contents[new_cursor.pos[0]].text = new_contents[new_cursor.pos[0]].text.slice(0, new_cursor.pos[1]);
         this.setState({ contents: new_contents });

         this.add_paragraph(new_p, paragraph_idx + 1);

         new_cursor.pos[0] = new_cursor.pos[0] + 1;
         new_cursor.pos[1] = 0;
      }

      // backspace
      if (event.keyCode == 8) {
         if (new_cursor.pos[1] > 0) {
            const new_contents = this.state.contents;
            new_contents[paragraph_idx].text =
               new_contents[paragraph_idx].text.slice(0, Math.max(0, new_cursor.pos[1] - 1)) +
               new_contents[paragraph_idx].text.slice(new_cursor.pos[1]);

            --new_cursor.pos[1];
         } else if (new_cursor.pos[0] > 0 && new_cursor.pos[1] === 0) {
            // handle going back to previous paragraph
            this.remove_paragraph(paragraph_idx);
   
            --new_cursor.pos[0];
            new_cursor.pos[1] = this.state.contents[paragraph_idx - 1].text.length;
         }
      }

      // left arrow key
      if (event.keyCode == 37) {
         if (new_cursor.pos[1] > 0) {
            --new_cursor.pos[1];
         } else if (new_cursor.pos[0] > 0) {
            --new_cursor.pos[0];
            new_cursor.pos[1] = this.state.contents[new_cursor.pos[0]].text.length;
         }
      }

      // up arrow key
      if (event.keyCode == 38) {
         // TODO: this needs more modifications to behave properly (needs to go up by pixels and then round to nearest char)
         // Also think about cases where paragraphs are more than 1 line long
         if (new_cursor.pos[0] > 0) {
            --new_cursor.pos[0];
            new_cursor.pos[1] = Math.min(
               new_cursor.pos[1],
               this.state.contents[new_cursor.pos[0]].text.length
            );
         }
      }

      // right arrow key
      if (event.keyCode == 39) {
         if (new_cursor.pos[1] < this.state.contents[new_cursor.pos[0]].text.length) {
            ++new_cursor.pos[1];
         } else if (new_cursor.pos[0] < this.state.contents.length - 1) {
            ++new_cursor.pos[0];
            new_cursor.pos[1] = 0;
         }
      }

      // down arrow key
      if (event.keyCode == 40) {
         // TODO: this needs more modifications to behave properly (needs to go up by pixels and then round to nearest char)
         // Also think about cases where paragraphs are more than 1 line long
         if (new_cursor.pos[0] < this.state.contents.length - 1) {
            ++new_cursor.pos[0];
            new_cursor.pos[1] = Math.min(
               new_cursor.pos[1],
               this.state.contents[new_cursor.pos[0]].text.length
            );
         };
      }

      // update cursor position
      this.cursor_set_pos(new_cursor.pos[0], new_cursor.pos[1]);
   }

   cursor_show() {
      const cursor = this.state.cursor;
      cursor.visible = true;

      this.setState({ cursor: cursor });
   }

   cursor_hide() {
      const cursor = this.state.cursor;
      cursor.visible = false;

      this.setState({ cursor: cursor });
   }

   cursor_set_pos(content_offset, char_offset) {
      var cursor = this.state.cursor;
      cursor.needs_update = true;
      cursor.pos = [content_offset, char_offset];

      this.setState({ cursor: cursor });
   }

   cursor_update() {
      const content_offset = this.state.cursor.pos[0];
      const char_offset = this.state.cursor.pos[1];

      const win_rect = this.editor_win.current.getBoundingClientRect();

      const win_padding_left = parseFloat(
         window.getComputedStyle(this.editor_win.current, null).getPropertyValue('padding-left')
      );

      const win_padding_top = parseFloat(
         window.getComputedStyle(this.editor_win.current, null).getPropertyValue('padding-top')
      );

      const win_border_left = parseFloat(
         window.getComputedStyle(this.editor_win.current, null).getPropertyValue('border-left')
      );

      const win_border_top = parseFloat(
         window.getComputedStyle(this.editor_win.current, null).getPropertyValue('border-top')
      );

      // top left pixel coord of the editor window
      const origin = {
         x: win_rect.x + win_padding_left + win_border_left,
         y: win_rect.y + win_padding_top + win_border_top
      };

      var coord = this.state.cursor.coord;
      if (content_offset >= 0 && content_offset < Object.entries(this.p_refs).length) {
         // now we need to find the pixel position of the character offset
         var orig_content = this.state.contents[content_offset].text;

         var new_content = orig_content.slice(0, char_offset)
            + '<span id="offset_check">_</span>'
            // getBoundingClientRect() returns [0, 0] if the last char is ' ' for some reason
            // so replace it with a visible character...
            + (orig_content.slice(char_offset) ? orig_content.slice(char_offset) : '_');

         this.p_refs[content_offset].current.p_node.innerHTML = new_content;
         var offset = document.getElementById('offset_check').getBoundingClientRect();
         this.p_refs[content_offset].current.p_node.innerHTML = orig_content;

         coord[0] = offset.x - origin.x;
         coord[1] = offset.y - origin.y;
      }

      return coord;
   }

   add_paragraph(contents = "", paragraph_idx = null) {
      const new_contents = this.state.contents;
      const p = this.create_paragraph(contents);
      const next_content_id = this.state.next_content_id + 1;

      if (!paragraph_idx || paragraph_idx > new_contents.length) {
         new_contents.push(p);
         paragraph_idx = new_contents.length - 1;
      } else {
         new_contents.splice(paragraph_idx, 0, p);
      }
      this.p_refs[paragraph_idx] = React.createRef();

      this.setState({
         next_content_id: next_content_id,
         contents: new_contents,
      });
   }

   // don't call this unless you want to manually add the returned paragraph object to state
   create_paragraph(contents = "") {
      var p = {
         key: this.state.next_content_id,
         debug: false,
         text: contents,
      };

      return p;
   }

   remove_paragraph(content_id) {
      const new_contents = this.state.contents;
      new_contents.splice(content_id, 1);

      delete this.p_refs[content_id];
      this.setState({ contents: new_contents });
   }

   render() {
      const items = [];
      for (const [index, tag] of this.state.contents.entries()) {
         items.push(
            <Paragraph
               key={tag.key}
               ref={this.p_refs[index]}
               className={this.state.debug ? 'debug' : undefined}
               content_id={tag.key}
               contents={tag.text}
               cursor_move={this.cursor_set_pos}
               cursor_show={this.cursor_show}
               cursor_hide={this.cursor_hide}
            />
         );
      }

      return (
         <React.Fragment>
            <p>{this.state.has_focus ? 'FOCUSED' : 'NOT FOCUSED'}</p>
            <div
               ref={this.editor_win}
               className="editor-window"
               tabIndex="0"
               onBlur={this._onBlur}
               onFocus={this._onFocus}
               onKeyUp={this._onKeyUp}
               onKeyDown={this._onKeyDown}
            >
               <Cursor
                  ref={this.cursor}
                  has_focus={this.state.has_focus}
                  is_visible={this.state.cursor.visible}
                  pos_x={this.state.cursor.coord[0]}
                  pos_y={this.state.cursor.coord[1]}
               />

               <div className="editor-window-contents">{items}</div>
            </div>
         </React.Fragment>
      );
   }
}
