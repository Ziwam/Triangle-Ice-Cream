import React, { Component } from 'react';

class Fill extends Component {

	render() {
		return (
			<div id="fill"><div className={this.props.fill_class}><img/><p>{this.props.text}</p></div></div>
		)
	}
}

export default Fill;