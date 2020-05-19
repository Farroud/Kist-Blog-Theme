//Create The Markup Of The Loading Progress Indicator
function createLoadingProgress () {
    'use strict';
    
    const DIV = document.createElement('div');
    
    DIV.setAttribute('style', 'position: fixed; top: 0; left: 0; height: 4px; width: 100%;z-index: 10');
    DIV.setAttribute('id', 'progress')
    DIV.innerHTML = `
        <div class="prog-indicator" style="height: 100%; width: 1%; background: #1e63ff;"></div>
    `;
    

    document.body.append(DIV);
}

// Loading Progress Update
function loadingProgress(e) {
    'use strict';

    const LOADER = document.getElementById('progress');
    let progress = (e.loaded / e.total) * 100;
    LOADER.firstElementChild.style.width =  progress + '%';

    if (progress == 100) {
         window.setTimeout( () => {
             LOADER.remove();
         }, 200 );
    }

}

//Loading The Articles From JSON Files
function initArticle() {
    'use strict';

    // AJAX Request Fetching Json DATA
    let XHR = new XMLHttpRequest();
    
    XHR.onloadend = function (e) {
        if (e.currentTarget.status == 200) {
            
            articles(JSON.parse(XHR.responseText));

        }
    }
    XHR.onloadstart = createLoadingProgress;
    XHR.onprogress = loadingProgress;
    
    XHR.open('GET', '../json/home.json');
    XHR.send();
    //////////////////////////////////

    
    // Create The Markup
    function articles(data) {

        const MOSTREADCONTAINER = document.querySelector('.first-most');
        const SECTHIRDCONTAINER = document.querySelector('.sec-third-most');
        const LATESTCONTAINER = document.querySelector('.latest-updated .articles');

        data.forEach((article) => {
            const ARTICLE = document.createElement('div');

            ARTICLE.classList.add("article");
            ARTICLE.setAttribute('data-id', article.id);

            ARTICLE.innerHTML = `
            <div class="article-tmb" style="background-image: url(${article.thumbnail})">
            <h4>${article.title}</h4>
            </div>
            <div class="info">
                <time>${article.date}</time>
                <div class="watches">
                    ${article.watch}&nbsp;
                    <i class="far fa-eye"></i>
                </div>
            </div>
            `;

            switch (article.arrangement) {
                case 1:
                    ARTICLE.firstElementChild.firstElementChild.classList.add('mst-r');
                    MOSTREADCONTAINER.appendChild(ARTICLE);
                    break;
                case 2:
                case 3:
                    SECTHIRDCONTAINER.appendChild(ARTICLE);
                    break;
                default:
                    LATESTCONTAINER.appendChild(ARTICLE);
                    break;
            }
             
            // Add Click Event For Showing The Article Content while Click on it
            ARTICLE.addEventListener('click', showArticle);
        });
    }
}
initArticle();
//Function toggling the class of the given 'this'
function toggleClass() {
    const TARGET = document.querySelector(this);
    TARGET.classList.toggle('show');
}

const MENU = document.querySelector('.menu');
MENU.addEventListener('click', toggleClass.bind('nav ul'));

function showArticle() {
    'use strict';
    
    const BODY = document.body;

    const ARTICLE = document.createElement('article');
    
    const ARTICLETHUMBNAIL = getComputedStyle(this.firstElementChild).backgroundImage.split('"')[1];
    
    const ARTICLETITLE = this.firstElementChild.firstElementChild.innerText;
    
    const ARTICLEID = this.dataset.id;

    ARTICLE.innerHTML = `
        <div class="react-close">
            <button class="close"><img style="width: 20px" src="../Images/close.svg"></button>
            <button class="react"><img style="width: 30px" src="../Images/clapping.svg"></div>
        </div>
        
        <div class="container">
            
            <div class="thumbnail" style="background-image: url(${ARTICLETHUMBNAIL})"></div>
            <div class="showed-article">
                <h2>${ARTICLETITLE}</h2>
                <div class="info">
                    ${this.lastElementChild.innerHTML}
                </div>
                <div class="content">
                </div>
            </div>
        </div>
    `
    BODY.appendChild(ARTICLE);
    window.scrollTo(0, 0);

    const ARTICLECONTENT = document.querySelector('article .showed-article .content');

    // Load The Article USING AJAX
    function loadArticle(artID) {

        let XHR = new XMLHttpRequest();

        let contentOBJ = {id: artID};

        XHR.onloadend = function () {

            if (XHR.status == 200) {
                contentOBJ.content = XHR.response;
                window.localStorage.setItem(`art${artID}`, contentOBJ.content);
                ARTICLECONTENT.innerHTML = window.localStorage[`art${ARTICLEID}`];
            }

        }
        XHR.onloadstart = createLoadingProgress;
        XHR.onprogress = loadingProgress;

        XHR.open('GET', `../articles/${artID}.html`);
        XHR.send();
    }

    // Check if the article exist in the local storage if not load it
    if (!!(window.localStorage[`art${ARTICLEID}`])) {
        ARTICLECONTENT.innerHTML = window.localStorage[`art${ARTICLEID}`];
    } else {
        loadArticle(ARTICLEID);
    }
    //  The Closing Button
    const CLOSE = Array.from(document.querySelectorAll('button.close'));
    CLOSE.forEach((button) => button.addEventListener('click', function () {
        this.parentElement.parentElement.remove();
    }));
}

