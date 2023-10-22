console.log('Файл подключён!');
document.addEventListener("DOMContentLoaded", () => {

  // прилипающая шапка
  let lastKnownScrollY = 0;
  let ticking = false;

  // console.log(lastKnownScrollY);
  // console.log(ticking);

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

      placeMark.add('mouseenter', function (e) {
        e.get('target').options.set('iconImageHref', './img/map/balun-hover.svg');
      });

      placeMark.add('mouseleave', function (e) {
        e.get('target').options.set('iconImageHref', './img/map/balun.svg');
      });
    }

    ymaps.ready(init);
  };


});



// техническая часть - УДАЛИТЬ НА ПРОДАКШЕНЕ!
// получить в консоли элемент, по которому кликнули
document.addEventListener('click', e => console.log(e.target));
