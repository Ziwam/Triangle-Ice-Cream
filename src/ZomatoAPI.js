//fetch results offset
let start = 0;

let results = [];

const key = '18b4cfd2ff967ee9565522d7dc71f152';

const headers = {
	'Accept': 'application/json',
	'user-key': key
}

export const getAll = () => 
	fetch(`https://developers.zomato.com/api/v2.1/search?entity_id=898&entity_type=city&start=${start}&cuisines=233%2C501`, {
		method: 'GET',
		headers
	})
		.then(res => res.json())
		.then(res => {

			results.push(...res.restaurants);

			//check to see if there are anymore results not grabbed
			if((start+res.results_shown)<res.results_found){
				start += res.results_shown;
				//return fetch if not done
				return getAll();
			}else{
				//return results if done
				return results;
			}
		})