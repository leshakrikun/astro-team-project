document.addEventListener('DOMContentLoaded', () => {

    let toTopBtn = document.querySelector('.to-up');
    const changeStyleSvg = document.querySelector('.strelka-top-1')

    window.onscroll = function () {   
    if (window.pageYOffset > 580) {
        toTopBtn.style.display = 'block'
    } else {
        toTopBtn.style.display = 'none';
        changeStyleSvg.classList.remove("strelka-change")
    }
}

// плавный скролл наверх 
toTopBtn.addEventListener('click', function () {
    window.scrollBy({
        top: -document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
        changeStyleSvg.classList.add("strelka-change");
    });
});