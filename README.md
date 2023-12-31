## **Задача:**

Сверстать макет постов на свое усмотрение по оформлению.
У каждого поста должно быть до 5 комментариев.
Должна быть возможность скрыть/раскрыть комментарии, по умолчанию скрыты.
Реализовать пагинацию (вывести на страницу по 10 постов)

Ресурсы:
-	Посты https://jsonplaceholder.typicode.com/posts
-	Комментарии https://jsonplaceholder.typicode.com/comments

Доп требования:
-	Данные необходимо при загрузке страницы формировать из ресурсов
-	Для разработки использовать JS ES 5/6. Jquery по усмотрению
-	Не использовать фреймворки

## ====================================

## Инициализация проекта:
- npm i

## Запуск сборки проекта:
- gulp

# Основные файлы сборки
| Файл | Назначение |
| ------ | ------ |
| gulpfile.js | содержит алгоритм сборки проекта |
| gulp.config.js | содержит необходимые данные и переменные для сборки |
| package.json | содержит используемые зависимости |
| package-lock.json | используется исключительно для блокировки зависимостей от определенного номера версии |

# Общая структура проекта
## Frontend проект преимущественно под вёрстку
- **index.html** - точка входа в проект (запускается проект из папки dist)
- В папке **src/component** хранится верстка модулей/страниц проекта.
- В папке **src/component** возможна вложенная структура из папок под разные разделы проекта.
- В папке **src/sass** хранится набор компонентов для определения стилей проекта.
- Проект может дополняться папками и файлами в рамках общей структуры / подхода.

## Структура папок

| Папка          | Назначение |
|----------------| ------ |
| dist/          | содержит все итоговые скомпилированные/минифицированные/оптимизированные файлы |
| dist/css/      | содержит итоговые скомпилированные/минифицированные/оптимизированные css файлы |
| dist/fonts/    | содержит все шрифты проекта |
| dist/js/       | содержит итоговые скомпилированные/минифицированные/оптимизированные js файлы |
| dist/media/    | содержит оптимизированные медиа файлы (картинки, svg, анимацию, видео) |
| src/           | содержит все черновые файлы проекта |
| src/component/ | содержит все html файлы |
| src/fonts/     | содержит все шрифты проекта |
| src/js/        | содержит используемые скрипты |
| src/media/     | содержит любые медиа файлы (картинки, svg, анимацию, видео) |
| src/sass/      | содержит структуру стилей всего проекта |


# Sass использование на проекте
В каждом каталоге должен быть файл .scss, объединяющий все остальные файлы из этого каталога.
В нашем случае этот файл  *_module.scss*
Проект может дополняться папками и файлами в рамках общей структуры / подхода.

| Папка     | Назначение                                                                               |
|-----------|------------------------------------------------------------------------------------------|
| base/     | включает глобальные стили, такие как сброс стилей, типография, цвета и т.д.              |
| layout/   | содержит стили для основных компонентов макета, таких как хедер, футер, навигация и т.д. |
| media/    | содержит медиаправила для компонентов макета.                                            |
| main.scss | выходной файл, в котором объединяются все стили.                                         |
