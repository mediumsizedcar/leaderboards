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
	for (let i = 0; i < profiles.length; i++) {
		const profile = profiles[i];
		const tr = document.createElement("tr");
		tr.classList.add(profile.classes.colour.toLowerCase());

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(i + 1));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		let a = document.createElement("a")
		a.href = "https://kamai.tachi.ac/u/" + profile.id + "/games/ongeki/Single"
		tr.lastChild.appendChild(a);
		a.appendChild(document.createTextNode(profile.rankingData.naiveRatingRefresh.ranking));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.appendChild(document.createTextNode(profile.name));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(profile.ratings.naiveRatingRefresh.toFixed(3)));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(profile.totalScores));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(getTimedeltaString(new Date() - profile.mostRecentScoreTimeAchieved, true)));

		tr.appendChild(document.createElement("td"));
		tr.lastChild.classList.add("num");
		tr.lastChild.appendChild(document.createTextNode(getTimedeltaString(profile.playtime, false)));
	}
}

main();