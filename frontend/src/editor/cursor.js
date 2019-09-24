import React from 'react'
import ReactDOM from 'react-dom'

export class Cursor extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         blink_state: true,
      };

      this.element = React.createRef();
   }

   componentDidMount() {
      this.interval = setInterval(
         () => {
            const blink_state = this.props.has_focus && this.props.is_visible && !this.state.blink_state;
            this.setState({blink_state: blink_state});
         },
         500
      );
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   render() {
      var is_visible = this.props.has_focus;
      is_visible &= this.state.blink_state;

      const style = {
         top: this.props.pos_y,
         left: this.props.pos_x
      };

      return (
         <div ref={c => (this.element = c)} className={"editor-cursor" + (!is_visible ? " editor-hidden" : "")} style={style}></div>
      );
   };
}
