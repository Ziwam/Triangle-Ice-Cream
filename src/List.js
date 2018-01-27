import React, { Component } from 'react';

class List extends Component {
	state = {
		query: '',
		display: []
	}

	updateQuery = (query) => {
		this.setState({query});
	}

	seletOption = (string) => {
		this.props.alrt(string);
	}

	filterDisplay = (event) => {
		event.preventDefault();
			let showingShops = [];
		if(this.state.query){
			const match = new RegExp(this.state.query, 'i');
			showingShops = this.props.data.filter((shop) => match.test(shop.restaurant.name));
			this.setState({display:showingShops});
		}else{
			this.setState({display:[]});
		}

		this.setState({query:''});

		this.props.setDisplay(showingShops);
		this.props.clearMarker();
	}
	
	render() {
		let showingShops;
		if(this.state.display.length > 0){
			showingShops = this.state.display;
		}else{
			showingShops = this.props.data;
		}

		return (
			<aside id="list">
				<h1>Locations</h1>
				<div className="input-wrapper">
				<form onSubmit={(e) => this.filterDisplay(e)}>
					<input
						type="text"
						placeholder="Enter an Ice Cream Shop"
						value={this.state.query}
						onChange={(ev) => this.updateQuery(ev.target.value)}/>
					</form>
					<div className="filter-button" onClick={(e) => this.filterDisplay(e)}>
						<i className="fa fa-filter"></i>
					</div>
				</div>
				<div className="list-wrapper">
					<ul className="shop-list">
						{showingShops.map((alpha,index) => (
							<li key={index} onClick={(e) => this.seletOption(alpha.restaurant.id,e)}>
								<p>{alpha.restaurant.name}</p>
							</li>
						))}
					</ul>
				</div>
			</aside>
		)
	}
}

export default List;