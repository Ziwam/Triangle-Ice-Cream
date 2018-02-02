import React, { Component } from 'react';

class List extends Component {
	state = {
		query: '',
		display: []
	}

	//save input value to query state
	updateQuery = (query) => {
		this.setState({query});
	}

	/*
		alerts parent component that menu item was clicked.
		passes shops id.
	*/
	seletOption = (string) => {
		this.props.alrt(string);
	}

	//filters list on submit/filter-button click
	filterDisplay = (event) => {
		event.preventDefault();

		let showingShops = [];
		if(this.state.query){
			const match = new RegExp(this.state.query, 'i');
			showingShops = this.props.data.filter((shop) => match.test(shop.restaurant.name));
			//sets shops view to state display
			this.setState({display:showingShops});
		}else{
			//empty display if no query
			this.setState({display:[]});
		}

		//resets query to empty string
		this.setState({query:''});

		//pass filtered list to parent
		this.props.setDisplay(showingShops);
		this.props.clearMarker();
	}
	
	render() {
		let showingShops;
		//checks if filtered list state has objectcs
		if(this.state.display.length > 0){
			//showingShops is set to filtered list
			showingShops = this.state.display;
		}else{
			//if no filtered list show original list
			showingShops = this.props.data;
		}

		return (
			<div id="list" role="menubar">
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
					<ul className="shop-list" role="list">
						{showingShops.map((shop,index) => (
							<li key={index} role="listitem" tabIndex="0" aria-labelledby={"lb"+index} onClick={(e) => this.seletOption(shop.restaurant.id,e)}>
								<p id={"lb"+index}>{shop.restaurant.name}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		)
	}
}

export default List;