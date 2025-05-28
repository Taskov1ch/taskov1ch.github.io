import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  // Получаем текущий путь (pathname) из объекта location
  const { pathname } = useLocation();

  // Используем хук useEffect для выполнения действия при изменении pathname
  useEffect(() => {
    // Выполняем скролл в начало страницы (координаты 0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Этот эффект будет срабатывать каждый раз, когда pathname изменяется

  // Этот компонент ничего не рендерит, он только выполняет побочный эффект
  return null;
}

export default ScrollToTop;
