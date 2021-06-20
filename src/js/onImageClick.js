import * as apiFetchRequest from './fetchRequests.js';
import imageCardsTpl from '../templates/filmCardDetail.hbs';

const userKey = '1ca3db2e1e1b7285b1391876caf4be93';
// const movieId = '10580';

const body = document.querySelector('.card__film');
const popUp = document.querySelector('#do');

body.addEventListener('click', onDisplayBigImg);

function fetchMovieById(id, key) {
  apiFetchRequest.fetchMovieDetails(id, key).then(movie => {
    const markup = renderFilmCard(movie);
    return markup;
  });
}

function onDisplayBigImg(e) {
  console.log(e.currentTarget)
  if (e.currentTarget.nodeName !== 'LI') {
    return;
  }
  const getIdFromImg = e.currentTarget.dataset.action;
    fetchMovieById(getIdFromImg, userKey);
    body.removeEventListener('click', onDisplayBigImg);
}

function renderFilmCard(movie) {
  const markup = imageCardsTpl(movie);
  popUp.innerHTML = markup;
  const buttonCloseModal = document.querySelector('[data-close]');

  window.addEventListener('keydown', onEscButtonPress);
  popUp.classList.remove('visually-hidden');
  buttonCloseModal.addEventListener('click', onCloseModal);
}

function onEscButtonPress(evt) {
  if (evt.code === 'Escape') {
    onCloseModal();
  }
}

function onCloseModal() {
  popUp.classList.add('visually-hidden');
  popUp.innerHTML = '';
    window.removeEventListener('keydown', onEscButtonPress);
    body.addEventListener('click', onDisplayBigImg);
}