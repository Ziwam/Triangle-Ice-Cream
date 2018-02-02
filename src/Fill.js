import React, { Component } from 'react';

class Fill extends Component {
	//creates component to show current status of fetch to the user.
	render() {
		return (
			<div id="fill" role="main"><div className={this.props.fill_class}><img/><p>{this.props.text}</p></div></div>
		)
	}
}

export default Fill;