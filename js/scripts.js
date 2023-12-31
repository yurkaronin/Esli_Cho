console.log('Файл подключён!');

// Функция, обрабатывающая клик или касание элемента.
const handleClickOrTouch = (element, callback) => {
  // Слушатель для события 'touchend' (завершение касания).
  const touchendListener = (e) => {
    e.preventDefault(); // Предотвращение стандартного действия
    element.removeEventListener('touchend', touchendListener); // Удаление слушателя после однократного выполнения
    callback(e); // Вызов переданного обратного вызова
  };

  // Добавление слушателя для события 'click' (клик мышью).
  element.addEventListener('click', callback);

  // Добавление слушателя для начала касания 'touchstart'.
  element.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Предотвращение стандартного действия
    element.addEventListener('touchend', touchendListener); // Добавление слушателя для завершения касания
  });
};

document.addEventListener("DOMContentLoaded", () => {

  // прилипающая шапка
  let lastKnownScrollY = 0;
  let ticking = false;

  console.log(lastKnownScrollY);
  console.log(ticking);

  function headerChange() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 160) {
      document.body.classList.add("scroll");
    } else {
      document.body.classList.remove("scroll");
    }

    ticking = false;
  }

  function onScroll() {
    lastKnownScrollY = window.scrollY;
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(headerChange);
    }
    ticking = true;
  }

  headerChange();
  window.addEventListener("scroll", onScroll, { passive: true });


  // Получение высоты блока шапки
  var headerHeight = document.querySelector(".header-group").getBoundingClientRect().height;

  // Получение всех ссылок в навигационном меню
  var navLinks = document.querySelectorAll(".navigation__link");

  // Добавление обработчика событий на каждую ссылку
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();  // Предотвращение стандартного действия ссылки

      // Получение целевого элемента, к которому нужно прокрутить
      var targetId = this.getAttribute("href").substring(1);  // Получение id без "#"
      var targetElement = document.getElementById(targetId);

      // Вычисление позиции прокрутки
      var scrollTo = targetElement.offsetTop - headerHeight;

      // Прокрутка к целевому элементу с учетом высоты шапки
      window.scrollTo({
        top: scrollTo,
        behavior: "smooth"
      });
      // Скрытие меню при клике на якорную ссылку
      navigation.classList.remove('isActive');
      buttonMenu.classList.remove('isActive');
      document.body.classList.remove('menu-open');
    });
  });

  // показ и скрытие кнопки прокрутки в начало страницы
  function handleScrollButtonVisibility() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollBtn = document.querySelector('.to-top');

    if (scrollTop > window.innerHeight) { // Если пользователь проскроллил ниже первого экрана
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  }

  // вызов функции для начального состояния
  handleScrollButtonVisibility();
  window.addEventListener("scroll", handleScrollButtonVisibility, { passive: true });

  // показ мобильного меню и кнопки
  const buttonMenu = document.querySelector('.button-menu');
  const navigation = document.querySelector('.navigation');
  buttonMenu.addEventListener('click', function () {
    buttonMenu.classList.toggle('isActive');
    navigation.classList.toggle('isActive');
    document.body.classList.toggle('menu-open');
  });

  // слайдер с логотипами
  const swiper = new Swiper('.js-slider-logotype', {
    // Optional parameters
    loop: true,
    autoplay: {
      delay: 2500,
    },
    breakpoints: {
      // when window width is >= 480px
      320: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 767px
      550: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 21
      }
    },
    // If we need pagination
    pagination: {
      el: '.js-slider-logotype .swiper-pagination',
      clickable: true,
    }
  });

  // Подключаем янекс карту на сайт
  if (document.querySelector('.js-map')) {
    let center = [45.100281810026644, 38.982007807675366];

    function init() {
      let mapElement = document.querySelector('.js-map');
      let map = new ymaps.Map(mapElement, {
        center: center,
        zoom: 17
      });

      let placeMark = new ymaps.Placemark([45.100281810026644, 38.982007807675366], {
        hintContent: 'Сервисный центр',
        balloonContentHeader: 'Сервисный центр ЕСЛИ ЧЁ',
        balloonContentFooter: 'Краснодар, Прикубанский округ, ул.Дзержинского, 100в (район ТЦ Красная площадь, напротив KFC)'
      }, {
        iconLayout: 'default#image',
        iconImageHref: './img/map/balun.svg',
        iconImageSize: [42, 56],
        iconImageOffset: [-19, -44]
      });

      map.controls.remove('geolocationControl');
      map.controls.remove('searchControl');
      map.controls.remove('trafficControl');
      map.controls.remove('typeSelector');
      map.behaviors.disable(['scrollZoom']);

      map.geoObjects.add(placeMark);

      placeMark.events.add('mouseenter', function (e) {
        e.get('target').options.set('iconImageHref', './img/map/balun-hover.svg');
      });

      placeMark.events.add('mouseleave', function (e) {
        e.get('target').options.set('iconImageHref', './img/map/balun.svg');
      });
    }

    ymaps.ready(init);
  };

  // Работа с модальными окнами
  // Поиск всех элементов с атрибутом data-target.
  let showDialogButtons = document.querySelectorAll('[data-target]');
  let targetClass = null;

  // Функция для установки слушателя на весь документ.
  const setupBodyClickListener = () => {
    // Добавление слушателя клика на весь документ.
    document.addEventListener('click', function listener(event) {
      // Проверка, был ли клик за пределами диалогового окна или на кнопку закрытия.
      if (!event.target.closest('.modal__body') || event.target.closest('.modal__close')) {
        // Удаление класса у элемента body.
        document.body.classList.remove(targetClass);
        targetClass = null;
        // Удаление слушателя после однократного выполнения.
        document.removeEventListener('click', listener);
      }
    });
  };

  // Для каждого найденного элемента с атрибутом data-target:
  showDialogButtons.forEach(button => {
    handleClickOrTouch(button, function (event) {
      event.preventDefault();  // Предотвращение стандартного действия
      event.stopPropagation(); // Остановка распространения события
      // Получение значения атрибута data-target.
      targetClass = event.currentTarget.getAttribute('data-target');
      // Добавление класса к элементу body.
      document.body.classList.add(targetClass);
      // Установка слушателя на весь документ.
      setupBodyClickListener();
    });
  });


  // кастомные селекты
  // Находим все select элементы
  var selects = document.querySelectorAll('.new-select');

  selects.forEach(function (select) {
    // Создаем обертку для кастомного select
    var customSelect = document.createElement('div');
    customSelect.className = 'custom-select';

    // Создаем элемент для выбранного значения
    var selectBox = document.createElement('div');
    selectBox.className = 'select-box';
    selectBox.textContent = select.options[select.selectedIndex].textContent; // первоначальное значение
    customSelect.appendChild(selectBox);

    // Создаем контейнер для опций
    var optionsContainer = document.createElement('div');
    optionsContainer.className = 'options';
    customSelect.appendChild(optionsContainer);

    // Создаем опции
    for (var i = 0; i < select.options.length; i++) {
      var option = document.createElement('div');
      option.textContent = select.options[i].textContent;
      option.dataset.value = select.options[i].value;

      // Если текущая опция является выбранной, добавьте класс
      if (select.selectedIndex === i) {
        option.classList.add('selected-option');
      }

      // Обновление selectBox при клике
      option.addEventListener('click', function () {
        selectBox.textContent = this.textContent;
        select.value = this.dataset.value;

        // Удалите класс 'selected-option' у всех опций
        var allOptions = optionsContainer.querySelectorAll('div');
        allOptions.forEach(function (opt) {
          opt.classList.remove('selected-option');
        });

        // Добавьте класс 'selected-option' для выбранной опции
        this.classList.add('selected-option');

        optionsContainer.style.display = 'none';
        customSelect.classList.remove('active');
      });
      optionsContainer.appendChild(option);
    }

    // Обработчик клика по selectBox
    selectBox.addEventListener('click', function () {
      optionsContainer.style.display =
        optionsContainer.style.display === 'block' ? 'none' : 'block';
      customSelect.classList.toggle('active');
    });

    // Вставляем кастомный select перед оригинальным и скрываем оригинальный
    select.parentNode.insertBefore(customSelect, select);
    select.style.display = 'none';
  });


  // валидация поля с телефоном
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  // Оборачиваем каждый input в div и добавляем блок для ошибок
  for (let input of phoneInputs) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('custom-form__item-wrapper');

    const errorMessage = document.createElement('span');
    errorMessage.classList.add('custom-form__error-message');

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(errorMessage);
  }

  // Добавляем валидацию
  for (let input of phoneInputs) {
    input.addEventListener('input', validatePhoneNumber);
  }

  // Проверка перед отправкой формы
  const forms = document.querySelectorAll('form');
  for (let form of forms) {
    form.addEventListener('submit', function (event) {
      for (let input of phoneInputs) {
        if (!validatePhoneNumber(input)) {
          event.preventDefault(); // Отменяем отправку формы
          alert('Пожалуйста, исправьте ошибки перед отправкой формы.');
          break;
        }
      }
    });
  }


});

function validatePhoneNumber(input) {
  const errorMessage = input.nextElementSibling;
  const value = input.value.replace(/\D/g, ''); // Убираем все, кроме цифр

  if (input.value !== value) {
      input.classList.add('error');
      errorMessage.textContent = 'введите телефонный номер, а не текст';
      return false;
  } else if (value.length < 11 && value.length > 0) {
      input.classList.add('error');
      errorMessage.textContent = 'слишком короткий номер';
      return false;
  } else if (value.length > 11) {
      input.classList.add('error');
      errorMessage.textContent = 'слишком длинный номер';
      return false;
  } else {
      input.classList.remove('error');
      errorMessage.textContent = '';
      return true;
  }
}



// техническая часть - УДАЛИТЬ НА ПРОДАКШЕНЕ!
// получить в консоли элемент, по которому кликнули
document.addEventListener('click', e => console.log(e.target));
