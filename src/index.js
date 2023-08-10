import './css/common.css';
import './css/01-gallery.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

const newApiSevice = new NewApiServise();

refs.searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  if (newApiSevice.query === []) {
    return alert('Введи щось добре');
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();

  newApiSevice.query = event.currentTarget.elements.searchQuery.value;
  newApiSevice.resetPage();

  try {
    const hits = await newApiSevice.fetchFoto();
    appendHitsMarkup(hits);
    loadMoreBtn.enable();
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
}

async function onLoadMore() {
  loadMoreBtn.disable();
  try {
    const hits = await newApiSevice.fetchFoto();
    emptyArrayHits(hits);
    clearHitsContainet();
    appendHitsMarkup(hits);
  } catch (error) {
    console.error('Error fetching more photos:', error);
  }
}
// ([
//   { webformatURL, tags, likes, views, comments, downloads },
// ])
function appendHitsMarkup(hits) {
  console.log(hits);
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
      }) => `<div class="photo-card">
      <a href="${largeImageURL}" class="gallery-link simplelightbox">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item js-info-likes">
          <b>Likes ${likes}</b>
        </p>
        <p class="info-item js-info-views">
          <b>Views ${views}</b>
        </p>
        <p class="info-item js-info-comments">
          <b>Comments ${comments}</b>
        </p>
        <p class="info-item js-info-downloads">
          <b>Downloads ${downloads}</b>
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

function emptyArrayHits() {
  // if (hits === []) {
  //   console.log(
  //     '"Sorry, there are no images matching your search query. Please try again."'
  //   );
  // }
  if (newApiSevice.query === []) {
    return alert('Введи щось добре');
  }
}

// galleryContainer.style.listStyle = 'none';
const lightbox = new SimpleLightbox('.simplelightbox', {
  /* options */
  captionsData: 'alt',
  captionDelay: 250,
});
