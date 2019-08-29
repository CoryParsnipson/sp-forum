import React from 'react'
import ReactDOM from 'react-dom'

import '../../assets/css/editor-base.css'

export class Paragraph extends React.Component {
   constructor(props) {
      super(props);

      this._onClick = this._onClick.bind(this);
   }

   _onClick() {
      // get's the cursor position (in characters) of the click
      const sel = document.getSelection();

      // use bounding rect to get the pixel coordinates of the selection
      if (sel.rangeCount) {
         var range = sel.getRangeAt(0).cloneRange();
         if (range.getClientRects && range.collapsed) {
            this.props.cursor_move(this.props.content_id, range.startOffset);
            this.props.cursor_show();
         } else {
            this.props.cursor_hide();
         }
      }
   }

   render() {
      return (
         <p
            ref={c => (this.p_node = c)}
            className = {this.props.className}
            onClick={this._onClick}
         >
            {this.props.contents}
         </p>
      );
   }
}
