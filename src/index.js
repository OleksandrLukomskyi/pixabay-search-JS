import './css/common.css';
import './css/01-gallery.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

import NewApiServise from './api.js';
import LoadMoreBtn from './load-more-btn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  renderingGallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const newApiService = new NewApiServise();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function handleSubmit(event) {
  event.preventDefault();

  // loadMoreBtn.hide();

  // loadMoreBtn.disable();

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
      console.log(loadMoreBtn.hide);
    } else {
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);

      appendHitsMarkup(hits);
      lightbox.refresh();
      loadMoreBtn.disable();
      loadMoreBtn.show();

      loadMoreBtn.enable();
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
}

async function onLoadMore() {
  // if (hits.length === O) {
  //   loadMoreBtn.hide();
  // }
  // loadMoreBtn.enable();
  try {
    const response = await newApiService.fetchFoto();
    const totalHits = response.totalHits;

    const hits = response.hits;

    // loadMoreBtn.disable();
    emptyArrayHits(hits);
    clearHitsContainet();

    appendHitsMarkup(hits);
    lightbox.refresh();

    // loadMoreBtn.enable();
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

  refs.renderingGallery.innerHTML = markup;
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
