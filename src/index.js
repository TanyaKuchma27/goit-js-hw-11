import photosTpl from './templates/photocard.hbs'
import './css/styles.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import PhotosApiService from './js/photos-service.js';

const ref = {
    search: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}

const photosApiService = new PhotosApiService();

ref.search.addEventListener('submit', onSearch);
ref.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(evt) {
    evt.preventDefault();
    
    photosApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    if (!photosApiService.query) {
        Notiflix.Notify.failure("Please, enter data.");
        return;
    };

    photosApiService.resetPage();

    try {
        const photos = await photosApiService.fetchPhotos();
        
        if (photos.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            return;
        };

        clearPhotosGallery();
        appendPhotosMarkup(photos);
        ref.loadMoreBtn.disabled = false;
        ref.loadMoreBtn.classList.remove('is-hidden');

    } catch(error) {
        console.log(error);
    }
};

async function onLoadMore() {
    ref.loadMoreBtn.disabled = true;
    try {
        const photos = await photosApiService.fetchPhotos();
        appendPhotosMarkup(photos);
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




// import photosTpl from './templates/photocard.hbs'
// import './css/styles.css';
// import Notiflix from 'notiflix';
// import 'notiflix/dist/notiflix-3.2.2.min.css';
// import PhotosApiService from './js/photos-service.js';

// const ref = {
//     search: document.querySelector(".search-form"),
//     gallery: document.querySelector(".gallery"),
//     loadMoreBtn: document.querySelector(".load-more"),
// }

// const photosApiService = new PhotosApiService();

// ref.search.addEventListener('submit', onSearch);
// ref.loadMoreBtn.addEventListener('click', onLoadMore);

// function onSearch(evt) {
//     evt.preventDefault();
    
//     photosApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
//     if (!photosApiService.query) {
//         Notiflix.Notify.failure("Please, enter data.");
//         return;
//     };

//     photosApiService.resetPage();
//     photosApiService.fetchPhotos()
//         .then(photos => {
//             if (photos.length === 0) {
//             Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
//             return;
//             }  
            
//             clearPhotosGallery();
//             appendPhotosMarkup(photos);
//             ref.loadMoreBtn.disabled = false;
//             ref.loadMoreBtn.classList.remove('is-hidden');        
//         });
// };

// function onLoadMore() {
//     ref.loadMoreBtn.disabled = true;
//     photosApiService.fetchPhotos().then(photos => {
//         appendPhotosMarkup(photos);
//         ref.loadMoreBtn.disabled = false;
//     });
// };

// function appendPhotosMarkup(photos) {
//   ref.gallery.insertAdjacentHTML('beforeend', photosTpl(photos));
// }

// function clearPhotosGallery() {
//   ref.gallery.innerHTML = '';
// }