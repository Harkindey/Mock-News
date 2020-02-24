let params = getParams(window.location),
	commentStart = 1,
	comments = [];
document.addEventListener('DOMContentLoaded', () => getNews());

const getNews = () => {
	Api.getNews(params.id)
		.then(res => {
			renderPost(res);
			getImages(params.id);
		})
		.catch(err => Notify.error(errhandler(err), getNews));
};

const renderPost = data => {
	let contentTitle = document.getElementById('content-title');
	contentTitle.innerHTML = `<h1>${data.title}</h1>
<span>by <b>${data.author}</b>. Posted on ${formatTime(
		data.createdAt
	)}.</span>`;
	getAllComments();
};

const getImages = id => {
	Api.getImages(id)
		.then(res => {
			if (!res.length) {
				Notify.info('No Images Found', getImages);
			}
			renderSlider(res);
		})
		.catch(err => errhandler(err));
};

const renderSlider = data => {
	let sliderContainer = document.getElementById('slideshow-container'),
		image = '';
	data.forEach((item, index) => {
		image += `
       <div class="mySlides fade">
                    <div class="numbertext">${index + 1}/ ${data.length}</div>
                    <img src="${item.image}" style="width:100%">
        </div>`;
	});

	sliderContainer.innerHTML = image;
	if (data.length) showSlides(1);
};

const addComment = () => {
	let authorField = document.getElementById('author'),
		commentField = document.getElementById('comment-id');
	const data = {
		newsId: params.id,
		name: authorField.value,
		comment: commentField.value,
		avatar: 'http://lorempixel.com/200/200/fashion',
	};
	if (!validateInput(data))
		return (document.getElementById('error').innerText =
			'Some fields are empty');
	document.getElementById('error').innerText = '';

	Api.createComment(params.id, data)
		.then(res => {
			comments = [...comments, res];
			Notify.success('Comment Created Successful');
			authorField.value = '';
			commentField.value = '';
			return;
		})
		.then(() => renderComments())
		.catch(err => Notify.error(errhandler(err), createComment));
};

const getAllComments = () => {
	Api.getAllComments(params.id, commentStart, 10)
		.then(res => {
			if (!res.length && commentStart > 1) {
				return Notify.info('No Comments Found');
			}
			comments = [...comments, ...res];
			return;
		})
		.then(() => renderComments())
		.catch(err => Notify.error(errhandler(err), getAllComments));
};
renderComments = () => {
	let commentBody = document.getElementById('comment-body');
	commentBody.innerHTML = '';
	document.getElementById('loaded-comment').innerText = `${
		comments.length
	} Comments Loaded`;

	comments.forEach((item, index) => {
		let commentItem = document.createElement('div');
		commentItem.setAttribute('class', 'comment-item');
		commentItem.innerHTML = `
		<div class="comment-avatar">
		<img src="${item.avatar}" alt="avatar">
	</div>
	<div class="comment-content">
		<span class="comment-author"><b>${
			item.name
		}</b></span> <span>Posted on ${formatTime(item.createdAt)}</span>
		<p>${item.comment}</p>
		<div>
			<button style="color:green;" id="edit_${
				item.id
			}" onclick="editListner(${index},${item.id})">Edit</button>
			<button style="color:red" id="delete_${item.id}" onclick="deleteComment(${
			item.newsId
		},${item.id})">Delete</button>
		</div>
	</div>
		`;
		commentBody.append(commentItem);
	});
};
const editListner = (index, commentId) => {
	let modal = document.getElementById('myModal'),
		updateButton = document.getElementById('update'),
		modalAuthor = document.getElementById('modal-author'),
		modalComment = document.getElementById('modal-comment'),
		span = document.getElementsByClassName('close')[0];

	modal.style.display = 'block';
	modalAuthor.value = comments[index].name;
	modalComment.value = comments[index].comment;

	updateButton.onclick = function() {
		let data = {
			name: modalAuthor.value,
			comment: modalComment.value,
			avatar: 'http://lorempixel.com/640/480/fashion',
		};
		if (!validateInput(data))
			return (document.getElementById('modal-error').innerText =
				'Some fields are empty');
		document.getElementById('modal-error').innerText = '';

		Api.updateComment(params.id, commentId, data)
			.then(res => {
				comments[index] = res;
				Notify.success('Comment Updated Successful');
				return;
			})
			.then(() => renderComments())
			.catch(err => Notify.error(errhandler(err)));
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

const deleteComment = (newsId, commentId) => {
	Api.deleteComment(newsId, commentId)
		.then(res => {
			comments = comments.filter(item => Number(item.id) !== commentId);
			return;
		})
		.then(() => renderComments())
		.catch(err => Notify.error(errhandler(err), deleteComment));
};

const LoadMoreComment = () => {
	commentStart++;
	getAllComments();
};
