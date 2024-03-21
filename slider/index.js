//Элементы на странице
const sliders = document.querySelectorAll('.hero2__wrapper');
const btnNext = document.querySelector('#right');
const btnPrev = document.querySelector('#left');
const bullits = document.querySelectorAll('.bullit');
const navs = document.querySelectorAll('.hero2_item');
console.log('sliders',sliders);
console.log('bullits',bullits);
console.log('navs',navs);

let currentIndex = 0;

bullits.forEach(function (bullit, index) {
    if(index===0) {
        bullit.classList.add('active');
    }
    bullit.addEventListener('click', () => {
        currentIndex = index;
        showNextSlide()
    })
})

navs.forEach(function (nav, index) {
    if(index===0) {
        nav.classList.add('active');
    }
    nav.addEventListener('click', () => {
        currentIndex = index;
        showNextSlide()
    })
})

sliders.forEach(function (slide, index) {

    //Добавляем индексы
    slide.dataset.index = index;

    //Скрываем все слайды, кроме первого
    if (index!==0){
        slide.classList.add('hidden')
    }else{
        slide.classList.add('active')
    }

});

btnNext.onclick = function() {
    currentIndex = currentIndex + 1 === sliders.length ? 0 : ++currentIndex;
    showNextSlide()
}    
    
btnPrev.onclick = function() {
    currentIndex = currentIndex === 0 ? sliders.length - 1 : --currentIndex;
    showNextSlide()
    }

function showNextSlide() {
    document.querySelector('.hero2__wrapper.active').classList.add('hidden');
    document.querySelector('.hero2__wrapper.active').classList.remove('active');

    document.querySelector('.bullit.active').classList.remove('active');
    bullits[currentIndex].classList.add('active');

    document.querySelector('.hero2_item.active').classList.remove('active');
    navs[currentIndex].classList.add('active');

    sliders[currentIndex].classList.remove('hidden');
    sliders[currentIndex].classList.add('active');

}

