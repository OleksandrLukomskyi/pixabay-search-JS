import './css/common.css';
import './css/01-gallery.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';

import debounce from 'lodash.debounce';

import NewApiServise from './api.js';

const refs = {
  searchForm: document.querySelector('.search-form'),
  renderingGallery: document.querySelector('.gallery'),
};

const newApiService = new NewApiServise();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let maxPage = 0;
let page = newApiService.page;

refs.searchForm.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', debounce(onScroll, 800));

async function handleSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchQuery.value.trim();

  newApiService.query = query;
  newApiService.resetPage();

  try {
    const response = await newApiService.fetchFoto();

    const totalHits = response.totalHits;

    const hits = response.hits;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    } else {
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
      clearHitsContainet();
      appendHitsMarkup(hits);
      lightbox.refresh();
      maxPage = Math.ceil(hits / 40);
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
}

async function onLoadMore() {
  try {
    const response = await newApiService.fetchFoto();
    const totalHits = response.totalHits;

    const hits = response.hits;

    emptyArrayHits(hits);
    // clearHitsContainet();

    appendHitsMarkup(hits);
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching more photos:', error);
  }
}

function appendHitsMarkup(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card gallery__item">
      <a href="${largeImageURL}" class="gallery-link ">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item js-info-likes">
          <b>Likes</b>
          <b>${likes}</b>
        </p>
        <p class="info-item js-info-views">
          <b>Views </b>
          <b>${views}</b>

        </p>
        <p class="info-item js-info-comments">
          <b>Comments </b>
          <b>${comments}</b>
        </p>
        <p class="info-item js-info-downloads">
          <b>Downloads </b>
          <b>${downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');

  refs.renderingGallery.insertAdjacentHTML('beforeend', markup);
}

function clearHitsContainet() {
  refs.renderingGallery.innerHTML = '';
}

function emptyArrayHits(hits) {
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again."'
    );
    loadMoreBtn.hide();
  }
}

function onScroll() {
  const scrollPosition = Math.ceil(window.scrollY);
  const bodyHeight = Math.ceil(document.body.getBoundingClientRect().height);
  const screenHeight = window.screen.height;
  if (bodyHeight - scrollPosition < screenHeight) {
    if (page <= maxPage) {
      onLoadMore();
    } else {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
}
