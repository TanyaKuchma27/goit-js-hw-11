import photosTpl from './templates/photocard.hbs'
import './css/styles.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import PhotosApiService from './js/photos-service.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
    search: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}

const photosApiService = new PhotosApiService();

ref.search.addEventListener('submit', onSearch);
ref.loadMoreBtn.addEventListener('click', onLoadMore);

let gallery = new SimpleLightbox('a.gallery-item', {
    captionDelay: 250,
});

async function onSearch(evt) {
    evt.preventDefault();
    
    photosApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    if (!photosApiService.query) {
        Notiflix.Notify.failure("Please, enter data.");
        return;
    };

    photosApiService.resetPage();

    try {
        const result = await photosApiService.fetchPhotos();
        const photos = result.hits;
        const totalHits = result.totalHits;
        if (totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            clearPhotosGallery();
            ref.loadMoreBtn.classList.add('is-hidden');
            return;
        } 

        const maxPage = Math.ceil(totalHits / 40);
        if (!(maxPage === 1)) {
            ref.loadMoreBtn.classList.remove('is-hidden');
            ref.loadMoreBtn.disabled = false;
        }
                    
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        clearPhotosGallery();
        appendPhotosMarkup(photos);
        gallery.refresh();
    } catch(error) {
        console.log(error);
    }
};

async function onLoadMore() {
    ref.loadMoreBtn.disabled = true;
    try {
        const result = await photosApiService.fetchPhotos();
        const photos = result.hits;
        const totalHits = result.totalHits;
        const maxPage = Math.ceil(totalHits / 40);
        const currentPage = photosApiService.page - 1;
        console.log(currentPage);
        if (maxPage === currentPage) {
            ref.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
        appendPhotosMarkup(photos);
        gallery.refresh();
        ref.loadMoreBtn.disabled = false;
    } catch(error) {
        console.log(error);
    };  
};

function appendPhotosMarkup(photos) {
  ref.gallery.insertAdjacentHTML('beforeend', photosTpl(photos));
}

function clearPhotosGallery() {
    ref.gallery.innerHTML = '';
}