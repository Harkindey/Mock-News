const Api = {
	getAllNews: (page, limit) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news?page=${page}&limit=${limit}`
		).then(response => {
			return response.json();
		});
	},
	getNews: id => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${id}`
		).then(response => {
			return response.json();
		});
	},
	createNews: data => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		).then(response => {
			return response.json();
		});
	},
	updateNews: (id, data) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		).then(response => {
			return response.json();
		});
	},
	deleteNews: id => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(response => {
			return response.json();
		});
	},
	getAllComments: (newsID, page, limit) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsID}/comments?page=${page}&limit=${limit}`
		).then(response => {
			return response.json();
		});
	},
	getComment: (newsID, commentID) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsID}/comments/${commentID}`
		).then(response => {
			return response.json();
		});
	},
	createComment: (newsID, data) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsID}/comments`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		).then(response => {
			return response.json();
		});
	},
	updateComment: (newsID, commentID, data) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsID}/comments/${commentID}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		).then(response => {
			return response.json();
		});
	},
	deleteComment: (newsID, commentID) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsID}/comments/${commentID}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(response => {
			return response.json();
		});
	},
	getImages: id => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${id}/images`
		).then(response => {
			return response.json();
		});
	},
	addImage: (newsId, data) => {
		return fetch(
			`https://5e4bfc87a641ed0014b02740.mockapi.io/api/clane/news/${newsId}/images`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		).then(response => {
			return response.json();
		});
	},
};

const getParams = function(url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

const validateInput = data => {
	let formIsValid = true;
	let fields = Object.keys(data);

	fields.map(field => {
		if (data[field] === '') {
			formIsValid = false;
		}
	});

	return formIsValid;
};

const errhandler = err => {
	// N E T W O R K - E R R O R
	if (err.message === 'Network Error' && err.response === undefined) {
		return "You are offline, try again when you're online!";
	}
	// S E R V E R - E R R O R
	else if (err.response && err.response.status) {
		console.log(err.response.data);
		return err.response.data.message;
	}
	// A N Y - O T H E R - I S S U E
	else {
		console.log('errhandler', { err });

		return 'There seems to be an issue with the request. Try again later.';
	}
};

const formatTime = timestamp => {
	return new Date(timestamp).toUTCString();
};

const notElement = document.getElementById('notification');

const Notify = {
	success: message => {
		notElement.style.display = 'flex';
		notElement.style.backgroundColor = 'green';
		if (document.getElementById('retry'))
			document.getElementById('retry').remove();
		document.getElementById('note').innerText = message;
	},
	info: message => {
		notElement.style.display = 'flex';
		notElement.style.backgroundColor = '#efefef';
		if (document.getElementById('retry'))
			document.getElementById('retry').remove();
		document.getElementById('note').innerText = message;
	},
	error: (message, cb = () => {}) => {
		notElement.style.display = 'flex';
		notElement.style.backgroundColor = 'red';
		if (!document.getElementById('retry')) {
			let retry = document.createElement('button');
			retry.innerText = 'Retry';
			retry.setAttribute('id', 'retry');
			retry.onclick = cb;
			notElement.insertBefore(
				retry,
				document.getElementById('note-close')
			);
		}
		document.getElementById('note').innerText = message;
	},
};

const closeNotification = () => {
	notElement.style.display = 'none';
};
