'use strict';
document.addEventListener('DOMContentLoaded', () => getAllNews(start));
let start = 1,
	navigation = document.getElementById('navigation'),
	newsContainer = document.getElementById('news-container'),
	currentNewsArray = [];

const createListner = () => {
	let modal = document.getElementById('myModal'),
		span = document.getElementsByClassName('close')[0];
	modal.style.display = 'block';

	span.onclick = function() {
		modal.style.display = 'none';
	};

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
};

const getAllNews = () => {
	Api.getAllNews(start, 10)
		.then(res => {
			if (!res.length) {
				start -= 1;
				getAllNews(start);
				return Notify.info('No More News Found');
			}
			currentNewsArray = res;
			return renderNews(res);
		})
		.catch(err => Notify.error(errhandler(err), getAllNews));
};

const renderNews = data => {
	newsContainer.innerHTML = '';
	data.forEach((item, index) => {
		let post = document.createElement('div');
		post.setAttribute('class', 'news');
		post.innerHTML = `
    <div class="news">
            <div class="news-image">
                <img src="./assets/img/unnamed.jpg" alt="news">
            </div>
            <div class="news-content">
                <a href="article/?id=${
					item.id
				}" style="text-decoration: none;color: #000;">${item.title}</a>
                <span>by <b>${item.author}</b>. Posted on ${formatTime(
			item.createdAt
		)}.</span>
		<div style="margin-top:10px">
			<button style="color:green;" id="edit_${
				item.id
			}" onclick="editListner(${index},${item.id})">Edit</button>
			<button style="color:red" id="delete_${item.id}" onclick="deleteNews(${
			item.id
		})">Delete</button>
		</div>
			</div>
        </div>
`;
		newsContainer.append(post);
	});
};

const editListner = (index, newsId) => {
	let modal = document.getElementById('myEditModal'),
		updateButton = document.getElementById('update'),
		editAuthor = document.getElementById('edit-author'),
		editTitle = document.getElementById('edit-title'),
		addImage = document.getElementById('add-image'),
		span = document.getElementsByClassName('close')[1];
	modal.style.display = 'block';
	editAuthor.value = currentNewsArray[index].author;
	editTitle.value = currentNewsArray[index].title;

	updateButton.onclick = function() {
		let data = {
			author: editAuthor.value,
			title: editTitle.value,
		};
		if (!validateInput(data))
			return (document.getElementById('edit-error').innerText =
				'Some fields are empty');
		document.getElementById('edit-error').innerText = '';

		Api.updateNews(newsId, data)
			.then(res => {
				currentNewsArray[index] = res;
				Notify.success('News Updated Successful');
				renderNews(currentNewsArray);
				return;
			})
			.catch(err => Notify.error(errhandler(err)));
	};

	addImage.onclick = () => {
		let data = {
			newsId: newsId,
			image: 'http://lorempixel.com/640/480/fashion',
		};
		Api.addImage(newsId, data).then(res => {
			Notify.success('Image Added to News');
		});
	};

	span.onclick = function() {
		modal.style.display = 'none';
	};

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
};

const deleteNews = newsId => {
	Api.deleteNews(newsId)
		.then(res => {
			getAllNews(start);
			return;
		})
		.catch(err => Notify.error(errhandler(err), deleteNews));
};
function loadPrevious() {
	start -= 1;
	if (start === 1) {
		navigation.children[0].remove();
	}
	getAllNews(start);
}

function loadNext() {
	start += 1;
	if (start === 2) {
		let previous = document.createElement('button');
		previous.setAttribute('class', 'btn btn-1');
		previous.addEventListener('click', loadPrevious);
		previous.innerHTML = `&larr; Previous`;
		navigation.insertBefore(previous, navigation.firstElementChild);
	}
	getAllNews(start);
}

const createNews = () => {
	let authorField = document.getElementById('author'),
		titleField = document.getElementById('title');
	const data = {
		author: authorField.value,
		title: titleField.value,
	};

	if (!validateInput(data))
		return (document.getElementById('error').innerText =
			'Some fields are empty');

	document.getElementById('error').innerText = '';

	Api.createNews(data)
		.then(res => {
			Notify.success('News Creation Succesful');
			authorField.value = '';
			titleField.value = '';
			getAllNews(start);
		})
		.catch(err => Notify.error(errhandler(err), createNews));
};
