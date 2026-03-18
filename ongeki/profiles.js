const profiles = [];

const getTimedeltaString = (totalMilliseconds, days) => {
	const totalSeconds = totalMilliseconds / 1000;
	const totalMinutes = totalSeconds / 60;
	const totalHours = totalMinutes / 60;
	if (days) {
		const totalDays = totalHours / 24;
		return Math.floor(totalDays) + "d" +
			Math.floor(totalHours % 24) + "h" +
			Math.floor(totalMinutes % 60) + "m" +
			Math.floor(totalSeconds % 60) + "s";
	} else {
		return Math.floor(totalHours) + "h" +
			Math.floor(totalMinutes % 60) + "m" +
			Math.floor(totalSeconds % 60) + "s";
	}
}

const main = async () => {
	const load = await fetch("../userdata/ongeki/Single.json");
	const userdata = await load.json();
	profiles.push(...userdata.profiles);
	draw(0);

	const lastUpdate = document.createElement("sub")
	lastUpdate.appendChild(document.createTextNode("Last update: " + new Date(userdata.lastUpdate)));
	document.querySelector("header").appendChild(lastUpdate);
};

function draw(sort) {
	const tbody = document.querySelector("tbody");

	switch (sort) {
		case 1:
			tbody.innerHTML = "";
			profiles.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});
			break;
		case 2:
			tbody.innerHTML = "";
			profiles.sort((a, b) => { return b.totalScores - a.totalScores });
			break;
		case 3:
			tbody.innerHTML = "";
			profiles.sort((a, b) => { return b.mostRecentScoreTimeAchieved - a.mostRecentScoreTimeAchieved });
			break;
		case 4:
			tbody.innerHTML = "";
			profiles.sort((a, b) => { return b.playtime - a.playtime });
			break;
		default:
			tbody.innerHTML = "";
			profiles.sort((a, b) => { return b.rating_refresh - a.rating_refresh });
			break;
	}

	for (let i = 0; i < profiles.length; i++) {
		const profile = profiles[i];
		const tr = document.createElement("tr");
		tr.classList.add(profile.classes.colour.toLowerCase());

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(i + 1));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(profile.rankingData.naiveRatingRefresh.ranking));

		tr.appendChild(document.createElement("td"));
		let a = document.createElement("a")
		a.href = "https://kamai.tachi.ac/u/" + profile.id + "/games/ongeki/Single"
		tr.lastChild.appendChild(a);
		a.appendChild(document.createTextNode(profile.name));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		a = document.createElement("a")
		a.href = "https://kamai.tachi.ac/u/" + profile.id + "/games/ongeki/Single/utils/refresh-rating"
		tr.lastChild.appendChild(a);
		a.appendChild(document.createTextNode(profile.ratings.naiveRatingRefresh.toFixed(3)));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(profile.totalScores));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(getTimedeltaString(new Date() - profile.mostRecentScoreTimeAchieved, true)));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(getTimedeltaString(profile.playtime, false)));

		tbody.appendChild(tr);
	}
}

main();