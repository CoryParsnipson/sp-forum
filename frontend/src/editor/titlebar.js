import React from 'react'
import ReactDOM from 'react-dom'

import { Window } from './window.js'

export class Titlebar extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         length: 0,
      }

      this._onKeyDown = this._onKeyDown.bind(this);
   }

   _onKeyDown(event) {
      const new_state = this.state;

      // want behavior of Titlebar to basically
      // be the same as Window except only allow
      // one line of input
      if (event.key === 'Enter') {
         event.stopPropagation();
         return;
      }

      // stop spacebar from scrolling window
      if (event.keyCode === 32) {
         event.preventDefault();
      }

      if (this.state.length >= this.props.max_length && event.keyCode != 8) {
         event.stopPropagation();
         return;
      }

      if (event.keyCode === 8) {
         new_state.length -= 1;
      } else {
         new_state.length += 1;
      }

      this.setState(new_state);
   }

   render() {
      return (
         <div onKeyDownCapture={this._onKeyDown}>
            <Window window_id="editor-window-title" />
         </div>
      );
   }
};

Titlebar.defaultProps = {
   max_length: 200,
}
