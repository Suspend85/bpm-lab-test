document.addEventListener('DOMContentLoaded', function () {
	const postsContainer = document.getElementById('posts-container');
	const paginationTopContainer = document.getElementById('pagination-top');
	const paginationBottomContainer = document.getElementById('pagination-bottom');
	const preloader = document.getElementById('preloader');
	const postsPerPage = 10; // Количество постов на странице
	const loadedPages = []; // Массив для хранения загруженных страниц
	const postsByPage = []; // Массив для кэширования постов по страницам
	let currentPage = 1; // текущая страница
	let totalPosts = 0; // Общее количество постов


	// Функция для создания кнопки пагинации
	function createPaginationButton(pageNumber) {
		const button = document.createElement('button');
		button.textContent = pageNumber;
		return button;
	}

	// Обработчик события нажатия на кнопку пагинации
	function handlePaginationButtonClick(pageNumber) {
		currentPage = pageNumber;
		updatePaginationButtons();
		loadPosts(currentPage);
	}

	// Функция для показа прелоадера
	function showPreloader() {
		preloader.style.display = 'flex';
	}

	// Функция для скрытия прелоадера
	function hidePreloader() {
		preloader.style.display = 'none';
	}

	// Функция для показа прелоадера загрузки комментариев
	function showCommentsPreloader(commentsContainer) {
		const preloader = document.createElement('div');
		preloader.className = 'comm-preloader';
		preloader.innerHTML = '<img src="/media/images/fountain.gif" alt="Загрузка...">';
		commentsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением прелоадера
		commentsContainer.appendChild(preloader);
	}

	// Функция для скрытия прелоадера загрузки комментариев
	function hideCommentsPreloader(commentsContainer) {
		const preloader = commentsContainer.querySelector('.comm-preloader');
		if (preloader) {
			commentsContainer.removeChild(preloader);
		}
	}

	// Функция для скрытия содержимого контейнера с постами
	function hidePostsContainer() {
		postsContainer.style.display = 'none';
	}

	// Функция для показа содержимого контейнера с постами
	function showPostsContainer() {
		postsContainer.style.display = 'block';
	}

	// Функция для вывода постов на странице
	function displayPosts(posts) {
		postsContainer.innerHTML = ''; // Очищаем контейнер перед выводом новых постов

		posts.forEach(post => {
			const postElement = document.createElement('div');
			postElement.classList.add('post');
			postElement.setAttribute('data-post-id', post.id); // Добавляем атрибут для идентификации поста
			postElement.innerHTML = `
										<p class="post__head">Пост <strong>№${post.id}</strong>. Опубликовал пользователь: <strong>${post.userId}</strong></p>
                    <h2 class="post__title">${post.title}</h2>
                    <p class="post__text">${post.body}</p>
                    <button class="toggle-comments">Показать комментарии</button>
                    <div class="comments-container"></div>
                `;
			postsContainer.appendChild(postElement);
		});

		// Добавляем обработчики для кнопок "Показать комментарии"
		const toggleButtons = document.querySelectorAll('.toggle-comments');
		toggleButtons.forEach(button => {
			button.addEventListener('click', () => {

				const postElement = button.closest('.post');
				const postId = postElement.getAttribute('data-post-id');
				const commentsContainer = postElement.querySelector('.comments-container');
				if (commentsContainer.innerHTML === '') {
					loadComments(postElement, postId);
					button.textContent = 'Скрыть комментарии';
				} else {
					commentsContainer.innerHTML = '';
					button.textContent = 'Показать комментарии';
				}
			});
		});
	}

	// Функция для загрузки комментариев к посту
	async function loadComments(postElement, postId) {
		try {
			const commentsContainer = postElement.querySelector('.comments-container');
			showCommentsPreloader(commentsContainer); // Показываем прелоадер

			const commentResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
			const comments = commentResponse.data;
			commentsContainer.innerHTML = '';

			comments.forEach(comment => {
				const commentElement = document.createElement('div');
				commentElement.classList.add('comment');
				commentElement.innerHTML = `
																<p class="comment__number margin-bot5">Коммент №<strong>${comment.id}</strong></p>
																<p class="comment__from margin-bot5">От: <strong><a href="mailto:${comment.email}">${comment.email}</a></strong></p>
																<h3 class="comment__name margin-bot5"><strong>${comment.name}</strong></h3>
																<p class="comment__body">${comment.body}</p>
                    `;
				commentsContainer.appendChild(commentElement);
			});

			hideCommentsPreloader(commentsContainer); // Прячем прелоадер после загрузки
		} catch (error) {
			console.error('Ошибка при загрузке комментариев:', error);
		}
	}

	// Функция для обновления кнопок пагинации
	function updatePaginationButtons() {
		const buttonsTop = paginationTopContainer.getElementsByTagName('button');
		const buttonsBottom = paginationBottomContainer.getElementsByTagName('button');

		for (let i = 0; i < buttonsTop.length; i++) {
			if (i + 1 === currentPage) {
				buttonsTop[i].classList.add('active');
				buttonsBottom[i].classList.add('active');
			} else {
				buttonsTop[i].classList.remove('active');
				buttonsBottom[i].classList.remove('active');
			}
		}
	}

	// Функция для загрузки и вывода постов с комментариями
	async function loadPosts(page) {
		try {
			showPreloader(); // Показать прелоадер перед загрузкой

			// Если страница уже загружена, просто отобразим посты без запроса
			if (loadedPages.includes(page)) {
				displayPosts(postsByPage[page - 1]); // Используем кэшированные посты
				hidePreloader(); // Скрыть прелоадер
				return;
			}

			hidePostsContainer(); // Скрыть контейнер с постами перед загрузкой

			// Если общее количество постов ещё не известно, получаем его из заголовка ответа
			if (totalPosts === 0) {
				const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=1`);
				totalPosts = response.headers['x-total-count'];
			}

			// Создание и добавление кнопок пагинации вверху и внизу страницы
			paginationTopContainer.innerHTML = '';
			paginationBottomContainer.innerHTML = '';

			for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
				const buttonTop = createPaginationButton(i);
				const buttonBottom = createPaginationButton(i);

				buttonTop.addEventListener('click', () => handlePaginationButtonClick(i));
				buttonBottom.addEventListener('click', () => handlePaginationButtonClick(i));

				paginationTopContainer.appendChild(buttonTop);
				paginationBottomContainer.appendChild(buttonBottom);
			}

			// Обновляем классы активных кнопок пагинации
			updatePaginationButtons();

			// Загрузка и кэширование постов только при нажатии на кнопку пагинации
			if (page === currentPage) {
				if (!postsByPage[page - 1]) {
					const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage}`);
					postsByPage[page - 1] = response.data; // Кэшируем загруженные посты

				}
				displayPosts(postsByPage[page - 1]);
			}

			hidePreloader(); // Скрыть прелоадер после загрузки (независимо от результата)
			showPostsContainer(); // Показать контейнер с постами после загрузки

			loadedPages.push(page); // Добавляем загруженную страницу в массив
		} catch (error) {
			console.error('Ошибка при загрузке постов:', error);
		}
	}

	// Загрузка первой страницы при загрузке страницы
	loadPosts(currentPage);
});

// Функция анимациия сслыки в хэдере
(function() {
	const links = document.querySelectorAll('.nav-link');
	const animateMe = function(e) {
		let navspan = this.querySelector('.nav-span');
		const { offsetX: x, offsetY: y } = e,
					{ offsetWidth: width, offsetHeight: height } = this;
		let move = 20;
		let xMove = x / width * (move * 2) - move;
		let yMove = y / height * (move * 2) - move;
		navspan.style.transform = `translate(${xMove}px, ${yMove}px)`;

		if (e.type === 'mouseleave') navspan.style.transform = '';
	};
	links.forEach(link => link.addEventListener('mousemove', animateMe));
	links.forEach(link => link.addEventListener('mouseleave', animateMe));
})();