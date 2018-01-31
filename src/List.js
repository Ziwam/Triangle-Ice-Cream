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
				<header><h2>Locations</h2></header>
				<div className="input-wrapper">
				<form onSubmit={(e) => this.filterDisplay(e)}>
					<input
						type="text"
						placeholder="Enter an Ice Cream Shop"
						value={this.state.query}
						role="textbox"
						onChange={(ev) => this.updateQuery(ev.target.value)}/>
					</form>
					<div className="filter-button" role="button" tabIndex="0" aria-label="filter" onClick={(e) => this.filterDisplay(e)}>
						<i className="fa fa-filter"></i>
					</div>
				</div>
				<div className="list-wrapper">
					<ul className="shop-list">
						{showingShops.map((shop,index) => (
							<li key={index} role="button" tabIndex="0" aria-labelledby={"lb"+index} onClick={(e) => this.seletOption(shop.restaurant.id,e)}>
								<p id={"lb"+index}>{shop.restaurant.name}</p>
							</li>
						))}
					</ul>
				</div>
			</aside>
		)
	}
}

export default List;