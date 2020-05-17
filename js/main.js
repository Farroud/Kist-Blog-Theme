//Function toggling the class of the given 'this'
function toggleClass() {
    const TARGET = document.querySelector(this);
    TARGET.classList.toggle('show');
}

const MENU = document.querySelector('.menu');
MENU.addEventListener('click', toggleClass.bind('nav ul'));
