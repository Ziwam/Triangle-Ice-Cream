import React, { Component } from 'react';

class List extends Component {
	state = {
		query: '',
		letters: [
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone",
			"Goofy Gooby",
			"Big Benjy's Ice Cream",
			"326 Ice Cream",
			"Haagen-Dozs",
			"The Ice Cream Clone"
		]
	}

	updateQuery = (query) => {
			this.setState({query});
	}

	render() {
		return (
			<aside id="list">
				<h1>Locations</h1>
				<div className="input-wrapper">
					<input
						type="text"
						placeholder="Enter a Ice Cream Shop"
						value={this.state.query}
						onChange={(ev) => this.updateQuery(ev.target.value)}/>
					<i className="fa fa-filter"></i>
				</div>
				<div className="list-wrapper">
					<ul className="shop-list">
						{this.state.letters.map((alpha,index) => (
							<li key={index}>
								<p>{alpha}</p>
							</li>
						))}
					</ul>
				</div>
			</aside>
		)
	}
}

export default List;