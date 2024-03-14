// Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// pageYOffset is a read - only window property that returns the number of pixels the document has been scrolled vertically.
// slice extracts a section of a string without modifying original string
//offsetTop - A Number, representing the top position of the element, in pixels

const books = [
	{
		id: 0,
		name: "In every mirrior she's black",
		img: "./ineverymirror.jpg",
		url: "https://1337co.de/4B",
		rating: "captivating writing.",
		rating_star: 4,
	},
	{
		id: 1,
		name: "Rise",
		img: "./rise-book.jpg",
		url: "https://1337co.de/4A",
		rating: "not yet reviewed",
		rating_star: 0,
	},
	{
		id: 2,
		name: "The Alchemist",
		img: "./alchemist.jpg",
		url: "https://1337co.de/4C",
		rating: "not yet reviewed",
		rating_star: 0,
	},
];

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

	let stars = range(item.rating_star).map(function () {
		return `<img
          alt=""
          className="gold-star"
          src="https://sandpack-bundler.vercel.app/img/gold-star.svg"
        />`;
	});
	stars = stars.join("");
	activeStars.innerHTML = stars;
});

const range = (start, end, step = 1) => {
	let output = [];

	if (typeof end === "undefined") {
		end = start;
		start = 0;
	}

	for (let i = start; i < end; i += step) {
		output.push(i);
	}

	return output;
};

//show book
function showBook(book) {
	const item = books[book];
	image.src = item.img;
	rating.textContent = item.rating;
	url.href = item.url;
	url.textContent = item.name;

	let stars = range(item.rating_star).map(function () {
		return `<img
          alt=""
          className="gold-star"
          src="https://sandpack-bundler.vercel.app/img/gold-star.svg"
        />`;
	});
	stars = stars.join("");
	activeStars.innerHTML = stars;
}

nextBtn.addEventListener("click", function () {
	currentItem++;
	if (currentItem > books.length - 1) {
		currentItem = 0;
	}
	showBook(currentItem);
});

prevBtn.addEventListener("click", function () {
	currentItem--;
	if (currentItem < 0) {
		currentItem = books.length - 1;
	}
	showBook(currentItem);
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
