const yuGiOhCards = fetch(
	"https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark"
);

yuGiOhCards
	.then((data) => data.json())
	.then((data) => {
		function makeCard(nameOf) {
			let cardArr = Object.values(nameOf);
			[dataOf] = cardArr;
			console.log(dataOf);
			const cardsMarkup = dataOf.map((card) => {
				return `
          <div class="card">
            <h2>${card.name}</h2>
            <p>Description: ${card.desc}</p>
            <p>Type: ${card.type}</p>
            <p>Attack: ${card.atk} <br> Defense: ${card.def}</p>
          </div>
        `;
			});
			return cardsMarkup.join(""); // join the array of markup strings into a single string
		}
		const allCardsContainer = document.getElementById("allCards");
		allCardsContainer.insertAdjacentHTML("beforeend", makeCard(data));
	})
	.catch((err) => console.log(err));
