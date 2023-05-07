// API
const dataOfCards =
	"https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark";

let allData = [];
const mainContainer = document.getElementById("allCards");

const favContainer = document.getElementById("favCards");
// Move Cards

const moveCard = (cardId, direction) => {
	const card = document.getElementById(cardId);

	if (direction === "toMain") {
		card.parentNode.removeChild(card);
		favContainer.appendChild(card);
	} else if (direction === "toFavs") {
		card.parentNode.removeChild(card);
		mainContainer.appendChild(card);
	}
};

// Create Type Counter
const counters = document.getElementById("count");

const typeData = [];

const makeCounters = (type, number) => {
	const counter = `<div class="counter ${type}">
										<span class="typeName"><strong>${type}: ${number}</strong></span>
									</div>`;
	counters.insertAdjacentHTML("beforeend", counter);
};

let normal = 0;
let effect = 0;
let flipEffect = 0;
let fusion = 0;

const countTypes = (arr, val) => {
	return arr.filter((v) => v === val).length;
};

const monsterTypes = [
	"Normal Monster",
	"Effect Monster",
	"Flip Effect Monster",
	"Fusion Monster",
];

// Create Cards
const makeCard = (id, name, img, type, desc, atk, def) => {
	const card = `<div id="${id}" class="card">
										<h3 class="name">${name}</h3>
										<div class="pic-window">
											<img class="pic" src="${img}"></img>
										</div>
											<div class="description">
												Type: <span class="type">${type}</span> <br>
												${desc}
											</div>
											<p class="atkDef">Atk: ${atk} Def: ${def}</p>
									</div>`;
	mainContainer.insertAdjacentHTML("beforeend", card);

	let direction;

	const cardElement = document.getElementById(id);
	cardElement.addEventListener("click", function () {
		if (cardElement.parentElement.id === "allCards") {
			direction = "toMain";
		} else if (cardElement.parentElement.id === "favCards") {
			direction = "toFavs";
		}
		moveCard(`${id}`, direction);
	});
};

async function getData(url) {
	const response = await fetch(url);

	const findData = (card) => {
		for (let info of card) {
			allData.push(info);
			typeData.push(info.type);
		}
	};

	var data = await response.json();
	findData(Object.values(data)[0]);

	allData.map((cardInfo) => {
		makeCard(
			allData.indexOf(cardInfo),
			cardInfo.name,
			cardInfo.card_images[0].image_url_cropped,
			cardInfo.type,
			cardInfo.desc,
			cardInfo.atk,
			cardInfo.def
		);
	});

	monsterTypes.forEach((type) => {
		makeCounters(type, countTypes(typeData, type));
	});
}

getData(dataOfCards);
// Sort Cards
const allItems = document.getElementsByClassName("card");

const sortMain = document.querySelectorAll(".sortBtn-main");
const sortFavs = document.querySelectorAll(".sortBtn-favs");

function sortData(direction, container) {
	const newArr = Array.from(container.querySelectorAll(".card"));
	const orderOfElements = (a, b) => {
		if (direction === "asc") {
			return a.id - b.id;
		} else if (direction === "desc") {
			return b.id - a.id;
		} else {
			return 0;
		}
	};
	newArr.sort(orderOfElements).forEach((item) => {
		container.appendChild(item);
	});
}

sortMain.forEach((item) => {
	const direction = item.dataset.sortdir;
	item.addEventListener("click", function () {
		sortData(direction, mainContainer);
	});
});

sortFavs.forEach((item) => {
	const direction = item.dataset.sortdir;
	item.addEventListener("click", function () {
		sortData(direction, favContainer);
	});
});
