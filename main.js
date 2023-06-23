// API
const cardApi =
	"https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark";

const mainContainer = document.getElementById("mainCards");
const favContainer = document.getElementById("favCards");

// Store relevant Data
let allCardInfo = [];

const findData = (card) => {
	allCardInfo.push(...card);
};

// Move Cards
const moveCard = (cardId, direction) => {
	const card = document.getElementById(cardId);
	card.parentNode.removeChild(card);

	if (direction === "toMain") {
		favContainer.appendChild(card);
	} else if (direction === "toFavs") {
		mainContainer.appendChild(card);
	}
};

const addClick = (cardId) => {
	const cardElement = document.getElementById(cardId);
	cardElement.addEventListener("click", () => {
		let direction;
		if (cardElement.parentElement.id === "mainCards") {
			direction = "toMain";
		} else if (cardElement.parentElement.id === "favCards") {
			direction = "toFavs";
		}
		moveCard(cardId, direction);
	});
};

// Make Cards
const makeCard = (id, name, img, type, desc, atk, def) => {
	const card = `<div id="${id}" class="card ${type}">
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
	addClick(id);
};

// Count types
const counters = document.getElementById("count");
const typeData = [];

const makeCounters = (type, number) => {
	const counter = `<div class="counter">
    <p class="typeName"><strong>${type}: ${number}</strong></p>
  </div>`;
	counters.insertAdjacentHTML("beforeend", counter);
};

const countTypes = (arr, val) => {
	return arr.filter((el) => el === val).length;
};

const filterDuplicates = (arr) => {
	return [...new Set(arr)];
};

// Retrieve data

const retrieveData = fetch(cardApi);
retrieveData
	.then((response) => response.json())
	.then((data) => data.data)
	.then(async (allData) => {
		const allMonsters = await Promise.all(allData);
		findData(allMonsters);
	})
	.then(() => {
		allCardInfo.forEach((cardInfo) => {
			const description = `${cardInfo.desc}`;
			const cutDesc = description.slice(0, 75) + `...`;
			makeCard(
				allCardInfo.indexOf(cardInfo),
				cardInfo.name,
				cardInfo.card_images[0].image_url_cropped,
				cardInfo.type,
				cutDesc,
				cardInfo.atk,
				cardInfo.def
			);
			typeData.push(cardInfo.type);
		});
		filterDuplicates(typeData).forEach((type) => {
			let count = countTypes(typeData, type);
			makeCounters(type, count);
		});
	});

// Sort Cards
const sortMain = document.querySelectorAll(".sortBtn-main");
const sortFavs = document.querySelectorAll(".sortBtn-favs");

function sortData(direction, container) {
	const newArr = Array.from(container.getElementsByClassName("card"));
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
	item.addEventListener("click", () => {
		sortData(direction, mainContainer);
	});
});

sortFavs.forEach((item) => {
	const direction = item.dataset.sortdir;
	item.addEventListener("click", () => {
		sortData(direction, favContainer);
	});
});
