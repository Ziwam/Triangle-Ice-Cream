import React, { Component } from 'react';
import cake_icon from './assets/piece-of-cake.svg'
import ice_cream_icon from './assets/ice-cream-cone.svg'
import yogurt_icon from './assets/frozen-yogurt.svg'

class List extends Component {
	state = {
		query: '',
		display: [],
		checked: true,
		sort: 'ratings'
	}

	//save input value to query state
	updateQuery = (query) => {
		this.setState({query});
	}

	handleClick = () => {
		this.setState({checked: !this.state.checked});
	}

	/*
		alerts parent component that menu item was clicked.
		passes shops id.
	*/
	seletOption = (string) => {
		this.props.alrt(string);
	}

	iconSelect = (elm) => {
		let attributes = "";
		switch(elm){
			case "Ice Cream":
				return <img src={ice_cream_icon} alt="ice_cream_icon" className="icon"/>;
				break;
			case "Frozen Yogurt":
				return <img src={ice_cream_icon} alt="ice_cream_icon" className="icon"/>;
				break;
			case "Desserts":
				return <img src={ice_cream_icon} alt="ice_cream_icon" className="icon"/>;
				break;
			default:
				return <img src={ice_cream_icon} alt="ice_cream_icon" className="icon"/>;
				break;
		}
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

	sortDisplay = (value) => {

		let showingShops = [];

		switch(value) {
			case "Ratings":
				showingShops = this.props.data.sort((a,b)=>{
					return (a.restaurant.user_rating.aggregate_rating > b.restaurant.user_rating.aggregate_rating)? -1:1;
				})
				break;
			case "Alphabetical":
				showingShops = this.props.data.sort((a,b)=>{
					return (a.restaurant.name < b.restaurant.name)? -1:1;
				})
				break;
			default:
				showingShops = this.props.data.filter((obj) => {
					return (obj.restaurant.cuisines.indexOf(value.toString()) >= 0)? true:false;
				})
				break;
		}

		this.setState({display:showingShops});

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
			<div>
				<div className="input-wrapper">
					<form onSubmit={(e) => this.filterDisplay(e)}>
						<input
							type="text"
							placeholder="Enter an Ice Cream Shop"
							value={this.state.query}
							role="textbox"
							onChange={(ev) => this.updateQuery(ev.target.value)}/>
							<input 
								type="submit" 
								value="submit"
								onClick={(e) => this.filterDisplay(e)}/>
					</form>
				</div>
				<div className="menu" role="menubar">
					<div className="toggle">
						<input type="checkbox" name="section" id="tog_list" checked={this.state.checked === true} onChange={this.handleClick}/>
						<label htmlFor="tog_list" className="toggle-label">Goals</label>
					</div>
					<div className={`list-wrapper ${this.state.checked? "active":""}`}>
			        	<div className="list-head">
							<div className="results">12 results</div>
							<select id="sort" onChange={(ev)=> this.sortDisplay(ev.target.value)}>
								<option value="Ratings">Ratings</option>
								<option value="Alphabetical">Alphabetical</option>
								{this.props.cuisineList.map((elm,index)=>(
									<option key={index} value={elm}>{elm}</option>	
								))}
							</select>
			        	</div>
						<ul className="shop-list" role="list">
							{showingShops.map((shop,index) =>(
								<li key={index} role="listitem" tabIndex="0" aria-labelledby={"lb"+index} onClick={(e) => this.seletOption(shop.restaurant.id,e)}>
									<div id={"lb"+index} className="item-info">
									{this.iconSelect(shop.restaurant.cuisines[0])}
										<div className="item-info">
											<div className="shop-name">{shop.restaurant.name}</div>
											<div className="border1"><div className="border2"></div></div>
											<div className="cuisine-list">{shop.restaurant.cuisines.join(" · ")}</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default List;