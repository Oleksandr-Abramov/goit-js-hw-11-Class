import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './js/services/api-service';

const refs = {
  input: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const api = new ApiService();

refs.input.addEventListener('submit', formInput);

function formInput(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  api.resetPage();
  api.request = refs.input.searchQuery.value;
  getInputApi();
  window.addEventListener('scroll', scrollListener);
}

async function getInputApi() {
  try {
    const responseFromApi = await api.fetchImages();
    makeGallery(responseFromApi);
    api.incrementPage();
  } catch (error) {
    console.error('Ошибочка', error);
  }
}

function makeGallery(images) {
  const totalHits = images.data.totalHits;
  alerts(totalHits);
  const arrayImg = images.data.hits;
  const marcup = arrayImg
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card"><div class="img-container"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></div><div class="info"><p class="info-item"><b>Likes</b><br>${likes}</p><p class="info-item"><b>Views</b><br>${views}</p><p class="info-item"><b>Comments</b><br>${comments}</p><p class="info-item"><b>Downloads</b><br>${downloads}</p></div></div></a>`,
    )
    .join('');
  renderGallery(marcup);
}

const lightbox = new SimpleLightbox('.gallery__item');

function renderGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  pageScroll();
  lightbox.refresh();
}

function alerts(totalHits) {
  const totalImages = (api.page - 1) * 40;
  if (totalHits === 0) {
    return Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`,
    );
  }

  if (totalHits / totalImages <= 1) {
    window.removeEventListener('scroll', scrollListener);
    return Notify.failure(`We're sorry, but you've reached the end of search results.`);
  }

  if (api.page === 1) {
    return Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

window.addEventListener('scroll', scrollListener);

function scrollListener() {
  if (
    window.scrollY + window.innerHeight - document.documentElement.scrollHeight < 1 &&
    window.scrollY + window.innerHeight - document.documentElement.scrollHeight > -1
  ) {
    getInputApi();
  }
}

function pageScroll() {
  if (api.page === 1) {
    const { height: formHeight } = refs.input.getBoundingClientRect();

    window.scrollBy({
      top: formHeight * 1.5,
      behavior: 'smooth',
    });
  }
}
