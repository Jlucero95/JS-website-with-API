const yuGiOhCards = fetch(
	"https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=metal%20raiders&attribute=dark"
);

yuGiOhCards.then((data) => data.json()).then((data) => console.log(data));
