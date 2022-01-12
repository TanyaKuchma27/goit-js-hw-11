import axios from "axios";

const key = '25186289-71226d48b5f529fb481c1afd8';
const url = 'https://pixabay.com/api/';

export default class PhotosApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  
  async fetchPhotos() {
    const https = `${url}?key=${key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    try {
      const responce = await axios.get(https);
      this.incrementPage();
      const photos = responce.data;
      return photos;
    } catch (error) {
      console.log(error);
      }
  } 

  incrementPage() {
    this.page += 1;
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