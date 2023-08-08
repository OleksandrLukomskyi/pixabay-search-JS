import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const BASE_API_KEY = '38668500-3efd4d7169d2bbbaccde2d953';
export default class NewApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchFoto() {
    return axios
      .get(
        `${BASE_URL}/?key=${BASE_API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=8`
      )
      .then(data => {
        this.page += 1;
        return data.data.hits;
      })
      .catch(error => {
        console.log(error);
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
