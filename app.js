// Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// pageYOffset is a read - only window property that returns the number of pixels the document has been scrolled vertically.
// slice extracts a section of a string without modifying original string
//offsetTop - A Number, representing the top position of the element, in pixels

const books = [
	{
		id: 0,
		name: "In every mirrior she's black",
		img: "./ineverymirror.jpg",
		url: "https://1337co.de/4y",
		rating: "captivating writing.",
		rating_star: 4,
	},
	{
		id: 1,
		name: "Rise",
		img: "./rise-book.jpg",
		url: "https://1337co.de/4x",
		rating: "not yet reviewed",
		rating_star: 3,
	},
	{
		id: 2,
		name: "The Alchemist",
		img: "./alchemist.jpg",
		url: "https://1337co.de/4z",
		rating: "not yet reviewed",
		rating_star: 0,
	},
];

/*stars array */
const ratingStars = [...document.getElementsByClassName("rating__star")];

//**set automatic date in footer**//
const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear();

//**toggle nav**//

const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
	/* linksContainer.classList.toggle("show-links"); */

	//dynamic toggle based on height of links
	const linksHeight = links.getBoundingClientRect().height;
	const containerHeight = linksContainer.getBoundingClientRect().height;

	if (containerHeight === 0) {
		linksContainer.style.height = `${linksHeight}px`;
	} else {
		linksContainer.style.height = 0;
	}
});

//**fix nav based on scroll**//

const navbar = document.getElementById("nav");
const topLink = document.querySelector(".top-link");

window.addEventListener("scroll", function () {
	const scrollHeight = window.pageYOffset;
	const navHeight = navbar.getBoundingClientRect().height;

	if (scrollHeight > navHeight) {
		navbar.classList.add("fixed-nav");
	} else {
		navbar.classList.remove("fixed-nav");
	}

	if (scrollHeight > 400) {
		topLink.classList.add("go-top");
	} else {
		topLink.classList.remove("go-top");
	}
});

//**map books**//

const image = document.getElementById("book");
const rating = document.getElementById("rating");
const url = document.getElementById("url");

const activeStars = document.querySelector(".stars");

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentItem = 0;

//load initial item
window.addEventListener("DOMContentLoaded", function () {
	const item = books[currentItem];
	image.src = item.img;
	rating.textContent = item.rating;
	url.href = item.url;
	url.textContent = item.name;
});

//show book
function showBook(stars, book) {
	const item = books[book];
	image.src = item.img;
	rating.textContent = item.rating;
	url.href = item.url;
	url.textContent = item.name;

	const starClassActive = "rating__star fas fa-star";
	const starClassInactive = "rating__star far fa-star";
	const starsLength = 5;
	const activeStars = item.rating_star;

	let i;
	stars.map((star) => {
		star.onclick = () => {
			i = activeStars - 1;
			console.log(item);
			console.log(i);
			if (star.className === starClassInactive) {
				for (i; i >= 0; --i) stars[i].className = starClassActive;
			} else {
				for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
			}
		};
	});
}

/**star rating**/
/* function executeRating(stars) {
	const item = books[currentItem];
	const starClassActive = "rating__star fas fa-star";
	const starClassInactive = "rating__star far fa-star";
	const starsLength = 5;
	const activeStars = item.rating_star;

	let i;
	stars.map((star) => {
		star.onclick = () => {
			i = activeStars - 1;
			console.log(item);
			console.log(i);
			if (star.className === starClassInactive) {
				for (i; i >= 0; --i) stars[i].className = starClassActive;
			} else {
				for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
			}
		};
	});
} */
//executeRating(ratingStars);
nextBtn.addEventListener("click", function () {
	currentItem++;
	if (currentItem > books.length - 1) {
		currentItem = 0;
	}
	showBook(ratingStars, currentItem);
});

prevBtn.addEventListener("click", function () {
	currentItem--;
	if (currentItem < 0) {
		currentItem = books.length - 1;
	}
	showBook(ratingStars, currentItem);
});

/** scroll**/
const scrollLinks = document.querySelectorAll(".scroll-link");
scrollLinks.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		const id = e.currentTarget.getAttribute("href").slice(1);
		const element = document.getElementById(id);

		const navHeight = navbar.getBoundingClientRect().height;
		const containerHeight = linksContainer.getBoundingClientRect().height;
		const fixedNav = navbar.classList.contains("fixed-nav");

		let position = element.offsetTop - navHeight;

		if (!fixedNav) {
			position = position - navHeight;
		}
		if (navHeight > 82) {
			position = position + containerHeight;
		}

		window.scrollTo({
			left: 0,
			top: position,
		});
		linksContainer.style.height = 0;
	});
});

/**form* */
const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
	e.preventDefault();
	const formData = new FormData(form);
	const object = Object.fromEntries(formData);
	const json = JSON.stringify(object);
	result.innerHTML = "Please wait...";

	fetch("https://api.web3forms.com/submit", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: json,
	})
		.then(async (response) => {
			let json = await response.json();
			if (response.status == 200) {
				result.innerHTML = "Form submitted successfully";
			} else {
				console.log(response);
				result.innerHTML = json.message;
			}
		})
		.catch((error) => {
			console.log(error);
			result.innerHTML = "Something went wrong!";
		})
		.then(function () {
			form.reset();
			setTimeout(() => {
				result.style.display = "none";
			}, 3000);
		});
});
