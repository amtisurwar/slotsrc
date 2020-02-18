import URI from './URI';
import axios from 'axios';

export default class API {
	constructor(url,params, headers = {}) {
		this.url = URI[url];
		this.params = params;
		this.headers = headers;
	}

	getURL() {
		return this.url;
	}

	getResponse() {
		return axios({
		  method: 'post',
		  url: this.url,
		  data: this.params,
		  headers: this.headers,
		}).then(result => {
			return result.data;
		}).catch(error => {
			return error;
		});
	}

	getApiResponse(queryString = '') {
		return axios.get(this.url+queryString);
	}

	getPutResponse(data) {
		
		return axios.put(this.url,data);
		
	}
}