import cardTpl from '../templates/popular-film-section.hbs';
import libraryCardTpl from '../templates/library-card.hbs';
import * as res from './fetches/fetchRequests';
import * as apiFetchGenres from './fetches/fetchGenres';
import { API_KEY } from './objects/API_KEY';
import { onLoader, stopLoader } from './main/loader';
import image from '../partials/dedpool.html';
import noImg from '../images/astro-team.png';

const gallery = document.querySelector('.js-gallery');

let genresList;
apiFetchGenres.fetchMovieGenres().then(data => (genresList = data.genres));

function createGallerySection(key, page) {
  onLoader();
  res.fetchTrending(key, page).then(movies => {
    addedGenres(movies, genresList);
    gallery.innerHTML = cardTpl(movies.results);
    for (let index = 0; index < movies.results.length; index++) {
      if (movies.results[index].poster_path === null) {
        let imgGalleryEl = gallery.querySelector(`[data-id="${movies.results[index].id}"]`);
        imgGalleryEl.src = `${noImg}`;
      }
    }
    stopLoader();
  });
}

function createSectionOnSearch(key, page, query) {
  onLoader();
  res.fetchSearchMovie(key, page, query).then(movies => {
    addedGenres(movies, genresList);
    gallery.innerHTML = cardTpl(movies.results);
    for (let index = 0; index < movies.results.length; index++) {
      if (movies.results[index].poster_path === null) {
        let imgGalleryEl = gallery.querySelector(`[data-id="${movies.results[index].id}"]`);
        imgGalleryEl.src = `${noImg}`;
      }
    }
    stopLoader();
  });
}

function createLibraryGallery(data) {
  onLoader();
  gallery.innerHTML = '';
  for (let id of data) {
    res.fetchMovieDetails(id).then(movie => {
      gallery.insertAdjacentHTML('afterbegin', libraryCardTpl(movie));
    });
  }
  stopLoader();
}

function addedGenres(movies, genresList) {
  for (let i = 0; i < movies.results.length; i += 1) {
    const movieResult = movies.results[i].genre_ids;
    for (let j = 0; j < genresList.length; j += 1) {
      for (let g = 0; g < movieResult.length; g += 1) {
        if (genresList[j].id === movieResult[g]) {
          movies.results[i].genre_ids[g] = ' ' + genresList[j].name;
        }
      }
    }
  }
}

function createDotsPagination(
  quantityOfTotalMovies,
  quantityOfMoviesOnPage,
  query = '',
  movies = '',
) {
  let totalMovies = quantityOfTotalMovies;
  let moviesOnPage = quantityOfMoviesOnPage;

  let numberOfPages = Math.ceil(totalMovies / moviesOnPage);
  if (!numberOfPages) {
    gallery.textContent = '';
    gallery.insertAdjacentHTML('afterbegin', image);
    return;
  } else if (numberOfPages === 1) {
    if (movies) {
      createLibraryGallery(movies);
    } else {
      if (query) {
        createSectionOnSearch(API_KEY, numberOfPages, query);
      } else {
        createGallerySection(API_KEY, numberOfPages);
      }
    }
    return;
  }

  if (numberOfPages > 1) {
    // Initialize Previous Button
    const paginationDOM = document.getElementById('pagination');
    const svgArrow = `<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 8h9.334M8 12.667L12.667 8 8 3.333" stroke="#000" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const arrowLeft = `<button class="previous" id="previous">${svgArrow}</button>`;
    paginationDOM.insertAdjacentHTML('beforeend', arrowLeft);

    // Initialize Previous Dots Button
    const previousDots = document.createElement('button');
    const previousDotsText = document.createTextNode('...');
    previousDots.appendChild(previousDotsText);
    previousDots.classList.add('previousDots');
    previousDots.setAttribute('id', 'previousDots');
    previousDots.style.display = 'none';

    //Create buttons from 1 to numberOfPages buttons
    for (let i = 0; i < numberOfPages; i++) {
      const button = document.createElement('button');
      const node = document.createTextNode(i + 1);
      if (i === 0) {
        button.appendChild(node);
        paginationDOM.appendChild(button);
        paginationDOM.appendChild(previousDots);
        button.classList.add('activePage');
      } else {
        button.appendChild(node);
        paginationDOM.appendChild(button);
      }
      button.setAttribute('id', i);
      button.classList.add('pages');
      button.setAttribute('data-value', `${i + 1}`);
    }

    // Initialize Next Dots Button
    const nextDots = document.createElement('button');
    const nextDotsText = document.createTextNode('...');
    const lastButtonElement = paginationDOM.lastElementChild;
    nextDots.appendChild(nextDotsText);
    nextDots.classList.add('nextDots');
    nextDots.setAttribute('id', 'nextDots');
    paginationDOM.insertBefore(nextDots, lastButtonElement);
    nextDots.style.display = 'inline-block';

    // Initialize Next Button

    const arrowRight = `<button class="next" id="next">${svgArrow}</button>`;
    paginationDOM.insertAdjacentHTML('beforeend', arrowRight);
  }

  const pages = document.querySelectorAll('.pages');

  pages.forEach(function (page) {
    page.addEventListener('click', e => pagination(e.target));
  });

  let activePage = document.querySelector('.activePage').dataset.value;

  if (pages.length > 5) {
    pages.forEach(function (page) {
      if (page.dataset.value > 5 && page.dataset.value < pages.length) {
        page.style.display = 'none';
      }
    });
  } else {
    pages.forEach(function (page) {
      page.style.display = 'inline-block';
    });
  }

  function pagination(e) {
    let activePageDOM = document.querySelector('.activePage');

    let previousActiveValue = activePageDOM.dataset.value;

    activePageDOM.classList.remove('activePage');

    document.getElementById(`${Number(e.dataset.value) - 1}`).classList.add('activePage');
    activePage = document.querySelector('.activePage').dataset.value;

    let i = activePage > 5 ? activePage - 2 : 1;

    if (Number(e.dataset.value) > previousActiveValue) {
      if (Number(e.dataset.value) < numberOfPages - 1) {
        for (let k = i; k <= Number(activePage) + 2; k += 1) {
          document.getElementById(`${k - 1}`).style.display = 'inline-block';
        }
      }

      for (let j = Number(activePage) - 4; j >= 1; j--) {
        document.getElementById(`${j}`).style.display = 'none';
        document.getElementById(`${j - 1}`).style.display = 'none';

        document.getElementById('previousDots').style.display = 'inline-block';
      }

      if (document.getElementById('previousDots').style.display === 'inline-block') {
        document.getElementById('0').style.display = 'inline-block';
      }
    } else if (Number(e.dataset.value) < previousActiveValue) {
      if (Number(e.dataset.value) <= numberOfPages - 1) {
        for (let l = Number(activePage) - 2; l <= Number(activePage) + 1; l += 1) {
          if (l <= 0) break;
          document.getElementById(`${l - 1}`).style.display = 'inline-block';
        }
      }
      for (let m = Number(activePage) + 2; m < numberOfPages; m += 1) {
        if (m + 1 <= numberOfPages - 1) {
          document.getElementById(`${m}`).style.display = 'none';
        }
      }
    }
    if (Number(activePage) === 1) {
      document.getElementById('previous').disabled = true;
      document.getElementById('previous').classList.add('inactiveLink');
      document.getElementById('next').disabled = false;
      document.getElementById('next').classList.remove('inactiveLink');
      document.getElementById(`${Number(activePage)}`).style.display = 'inline-block';
      if (numberOfPages > 2) {
        document.getElementById(`${Number(activePage) + 1}`).style.display = 'inline-block';
      }
    } else if (Number(activePage) === numberOfPages) {
      document.getElementById('next').disabled = true;
      document.getElementById('next').classList.add('inactiveLink');
      document.getElementById('previous').disabled = false;
      document.getElementById('previous').classList.remove('inactiveLink');
      document.getElementById(`${numberOfPages - 2}`).style.display = 'inline-block';
      if (numberOfPages > 2) {
        document.getElementById(`${numberOfPages - 3}`).style.display = 'inline-block';
      }
    } else {
      document.getElementById('previous').classList.remove('inactiveLink');
      document.getElementById('next').classList.remove('inactiveLink');
      document.getElementById('previous').disabled = false;
      document.getElementById('next').disabled = false;
    }

    if (document.getElementById('1').style.display === 'inline-block') {
      document.getElementById('previousDots').style.display = 'none';
    }
    if (document.getElementById(`${numberOfPages - 2}`).style.display === 'inline-block') {
      document.getElementById('nextDots').style.display = 'none';
    } else {
      document.getElementById('nextDots').style.display = 'inline-block';
    }

    let numberOfPage = Number(activePage);
    if (movies) {
      let start = (numberOfPage - 1) * moviesOnPage;
      let end = start + moviesOnPage;
      let renderMovies = movies.slice(start, end);
      createLibraryGallery(renderMovies);
    } else {
      if (query) {
        createSectionOnSearch(API_KEY, numberOfPage, query);
      } else {
        createGallerySection(API_KEY, numberOfPage);
      }
    }
  }

  function nextPrevious(e) {
    if (e.currentTarget.getAttribute('id') === 'next') {
      let nextButton = document.getElementById(Number(activePage));
      pagination(nextButton);
    } else if (e.currentTarget.getAttribute('id') === 'previous') {
      let previousButton = document.getElementById(Number(activePage) - 2);
      pagination(previousButton);
    }
  }

  const eventButton1 = document.getElementById('0');
  pagination(eventButton1);

  document.querySelector('.next').addEventListener('click', e => nextPrevious(e));
  document.querySelector('.previous').addEventListener('click', e => nextPrevious(e));
}

export default createDotsPagination;
