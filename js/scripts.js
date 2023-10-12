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
  navLinks.forEach(function(link) {
      link.addEventListener("click", function(e) {
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
      });
  });

});

// техническая часть - УДАЛИТЬ НА ПРОДАКШЕНЕ!
// получить в консоли элемент, по которому кликнули
document.addEventListener('click', e => console.log(e.target));
