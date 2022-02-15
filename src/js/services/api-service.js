class ApiService {
  API_KEY = '25611286-d3301de9845eb7113c68c548e';
  BASE_URL = 'https://pixabay.com/api/';
  page = 1;
  request = '';
  static axios = require('axios').default;

  set request(newRequest) {
    this.request = newRequest;
  }

  fetchImages() {
    const params = new URLSearchParams({
      key: this.API_KEY,
      q: this.request,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    try {
      return ApiService.axios.get(`${this.BASE_URL}?${params}`);
    } catch (error) {
      console.error('Ошибочка', error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get page() {
    return this.page;
  }
}

export default ApiService;
