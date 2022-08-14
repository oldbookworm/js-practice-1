'use strict';

// ============= DATA ================

// const MIN_ID = 1;
// const MAX_ID = 25;
// const MIN_COMMENT_ID = 1;
// const MAX_COMMENT_ID = 200;
// const MIN_URL = 1;
// const MAX_URL = 25;
// const MIN_COMMENT_AVATAR = 1;
// const MAX_COMMENT_AVATAR = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;      
const IDS = getShuffledArr(1, 25);
const IDS_COMMENTS = getShuffledArr(1, 200);
const URLS = getShuffledArr(1, 25);
const COMMENT_AVATARS = getShuffledArr(1, 6);
const SIMILAR_USERS_COUNT = 25;
const DESCRIPTIONS_TEXT = [
  'В жизни лучше чем на фото',
  'Моя жизнь - мои правила!',
  'Наслаждаюсь каждым мгновением',
  'Когда мечты становятся реальностью',
  'Как то так проходит мой отпуск',
  'Чем я занимаюсь вместо того чтобы работать',
  'Было непросто, но оно того стоило',
  'Жизнь предпринимателя',
  'Успех – это решения, которые ты принимаешь каждый день',
  'Меньше слов, больше действий',
  'Не важно, как сильно ты о чем-то мечтаешь, важно, что ты для этого делаешь',
  'Не строю скромных планов',
  'Что вы об этом думаете?',
  'Разве не потрясающе?',
  'Угадайте, где я',
  'Время приключений!',
  'Открываю для себя мир. Скоро вернусь',
  'Лучший день',
  'Что это было?',
  'Отличный день для торта',
  'Я построил замок из тех камней, которые в меня бросали',
  'Да, еще одно фото',
  'Если жизнь подкидывает мне лимоны, я делаю из них лимонад',
  'Время перемен',
  'Снова в дороге',
];
const COMMENT_NAMES = ['Васян', 'Аристархий', 'Ололош', 'Мирабелла Петровна', 'Натусечка Конфетюсечка', 'Анька', 'Геннадий Петрович Бздыщ', 'Нонейм', 'Лёха', 'Октябрина Геннадьевна'];
const COMMENTS_TEXT = [
  'Книга хорошая, спору нет',
  'Великолепные аллюзии на современные реалии! Браво!',
  'А о моему, это какое то говно',
  'Не читал, но осуждаю',
  'Потебня крутится в гробу',
  'Сойдет почитать в метро',
  'Красивенько'
];

// ================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =============

// получить рандомное число
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};


// получить рандомный элемент массива
function getRandomArrayElement(elements) {
  return elements[getRandomNumber(0, elements.length - 1)];
};

// получаем массив с заданными числами
function getShuffledArr(min, max) {
  const newArr = [];
  for (let i = min; i <= max; i++) {
    newArr.push(i);
  }
  shuffle(newArr);
  return newArr;
};

// тасуем массив

function shuffle(array) {
  for(let i = array.length-1; i>0; i--) {
    let j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  };
};



// ============== РАНДОМНЫЕ ЮЗЕРЫ ==============


// создаем карточку юзера
function createUser(elemId) {
  return {
    id: IDS[elemId],
    url: 'photos/' + URLS[elemId] + '.jpg',
    description: getRandomArrayElement(DESCRIPTIONS_TEXT),
    likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
    comments:  getUsersComments(getRandomNumber(0, 6)),
  } 
};

// заполняем массив карточками юзеров
function getSimilarUsers(usersNumber) {
  const usersArr = [];
  for (let i = 0; i < usersNumber; i++) {
    let j = createUser(i);
    usersArr.push(j);
  };
  return usersArr;
};

// собираем массив комментариев для юзера
function getUsersComments(commentsNumber) {
  const commentsArr = [];
  for (let i = 0; i < commentsNumber; i++) {
    let j = {
      id: IDS_COMMENTS[i],
      avatar:'img/avatar-' + COMMENT_AVATARS[i] + '.svg',
      name: getRandomArrayElement(COMMENT_NAMES),
      message: getRandomArrayElement(COMMENTS_TEXT),
    }
    commentsArr.push(j);
  };
  return commentsArr;
}

// готовый массив с карточками юзеров
let similarUsersArr = getSimilarUsers(SIMILAR_USERS_COUNT);

console.log(similarUsersArr);
console.log(getUsersComments);



// ========= ЗАПОЛНЕНИЕ СТРАНИЦЫ РАНДОМНЫМИ ЮЗЕРАМИ =========

const picturesBlock = document.querySelector('.pictures');

const templateFragment = document.querySelector('#picture')
.content.querySelector('.picture');

const similarListFragment = document.createDocumentFragment();

similarUsersArr.forEach(({url, comments, likes, description}) => {
  const pictureElement = templateFragment.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__description').textContent = description;
  
  similarListFragment.appendChild(pictureElement);
});

picturesBlock.appendChild(similarListFragment);




// ПОЛНОЭКРАННЫЙ ПОКАЗ И СКРЫТИЕ ИЗОБРАЖЕНИЯ

// блок с большой фотографией
const bigPictureBlock = document.querySelector('.big-picture');

// кнопка закрытия большого блока
const closeModalBtn = document.querySelector('.big-picture__cancel');

// Проверка на нажатие ESC
const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};

// Проверка на нажатие ENTER
const isEnterEvent = (evt) => {
  return evt.key === 'Enter';
};

// обработчик события открытия большого фото
// по клику
picturesBlock.addEventListener('click', (evt) => {
  evt.preventDefault();
  const targetPhoto = event.target.closest('a');
  getPhotoData(targetPhoto);
});

// по клавише
picturesBlock.addEventListener('keydown', (evt) => {
  if (isEnterEvent (evt)) {
    evt.preventDefault();
    const targetPhoto = event.target.closest('a');
    getPhotoData(targetPhoto);
  }
});

// получить значение из таргетного фото
function getPhotoData(targetPhoto) {

  // берем информацию таргетного фото
  const photoUrl = targetPhoto.querySelector('.picture__img').src;
  const photoLikes = targetPhoto.querySelector('.picture__likes').textContent;
  const photoDescr = targetPhoto.querySelector('.picture__description').textContent;

  // и записываем ее в большое фото
  bigPictureBlock.querySelector('.big-picture__pic').src = photoUrl;
  bigPictureBlock.querySelector('.likes-count').textContent = photoLikes;
  bigPictureBlock.querySelector('.social__caption').textContent = photoDescr;

  
  // затем открываем попап
  openBigPhotoModal();
}

// Функция открытия большого фото 
function openBigPhotoModal(url, likes) {
  bigPictureBlock.classList.remove('hidden');

  // когда окно открыто его можно закрыть ESC
  document.addEventListener('keydown', (evt) => {
    if (isEscEvent (evt)) {
    evt.preventDefault();
    bigPictureBlock.classList.add('hidden');
  }
  });
};

// обработчик события закрытия большого фото по клику на крестике
closeModalBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeUserModal();
});


// функция закрытия окна
 function closeUserModal() {
  bigPictureBlock.classList.add('hidden');
 };




// ОТКРЫТИЕ/ЗАКРЫТИЕ ЗАГРУЖЕНОГО ИЗОБРАЖЕНИЯ
// кнопка формы
const uploadPhotoForm = document.querySelector('.img-upload');

// кнопка модального окна с редактированием изображения
const changerPhotoModal = document.querySelector('.img-upload__overlay');

// кнопка закрытия окна
const changerModalCloseBtn = document.querySelector('.img-upload__cancel');


// функция открытия окна
function openChangerPhotoModal (targetPoint) {
  if (targetPoint.className != 'img-upload__form') {
    return;
  } else {
    changerPhotoModal.classList.remove('hidden');
    body.classList.add('modal-open'); 
  }; 
};

 // функция закрытия окна
function closeChangerModal() {
  changerPhotoModal.classList.add('hidden');
  cleanStyles(uploadPhoto);
  scaleValue.value = '100%';
  removeEffectClass();
}


// Открытие по клику
uploadPhotoForm.addEventListener('click', (evt) => {
  evt.preventDefault();
  const targetPoint = event.target.closest('form');
  openChangerPhotoModal(targetPoint);
});


// Открытие кнопкой
uploadPhotoForm.addEventListener('keydown', (evt) => {
  if (isEnterEvent (evt)) {
    evt.preventDefault();
    const targetPoint = event.target.closest('form');
    openChangerPhotoModal(targetPoint);
  }
});


// Закрытие кликом
changerModalCloseBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  closeChangerModal();
});

// Закрытие кнопкой
 document.addEventListener('keydown', (evt) => {
    if (isEscEvent (evt)) {
    evt.preventDefault();
    closeChangerModal();
  };
  });


// функция очистки стилей после закрытия окна
function cleanStyles (elem) {
  elem.style = '';
}


// ИЗМЕНЕНИЕ РАЗМЕРА ИЗОБРАЖЕНИЯ

const smallerBtn = document.querySelector(".scale__control--smaller");
const biggerBtn = document.querySelector(".scale__control--bigger");
const scaleValue = document.querySelector(".scale__control--value");
const uploadPhoto = document.querySelector(".img-upload__preview");
const STEP = 25;

smallerBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  getSmallerPhoto();
});

biggerBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  getBiggerPhoto();
});


function getSmallerPhoto() {
  let smallerValue = parseInt(scaleValue.value);

  if (smallerValue != 25) {
    smallerValue = smallerValue - STEP;
    scaleValue.value =  smallerValue;
    uploadPhoto.style.transform = `scale(0.${smallerValue})`;
  } 
}


function getBiggerPhoto() {
  let biggerValue = parseInt(scaleValue.value);

   if (biggerValue != 100) {
    biggerValue = biggerValue + STEP;
    scaleValue.value =  biggerValue;
      if (biggerValue == 100) {
    uploadPhoto.style.transform = 'scale(1)';  
  }else uploadPhoto.style.transform = `scale(0.${biggerValue})`;
  };
}


// СЛАЙДЕР

const effectSlider = document.querySelector('.effect-level__slider');


noUiSlider.create(effectSlider, {
    start: 50,
    connect: true,
    range: {
        'min': 0,
        'max': 100,
    }
});

// ПЕРЕКЛЮЧЕНИЕ ЭФФЕКТОВ

// список с эффектами
const effectsList = document.querySelector('.effects__list');


effectsList.addEventListener('click', (evt) => {
  evt.stopPropagation();
  removeEffectClass();
  const targetEffect = event.target.closest('input').value;
  addEffectClass(targetEffect);
});

// удаляем эффекты при переключении оставляя только базовый класс
function removeEffectClass() {
  uploadPhoto.className = 'img-upload__preview';
}

function addEffectClass(effect) {
  const effectClass = `effects__preview--${effect}`;
  uploadPhoto.classList.add(effectClass);

}