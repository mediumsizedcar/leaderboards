#!/usr/bin/env python

import datetime
import json
import requests
from enum import Enum
from pathlib import Path

BASE_URL = "https://kamai.tachi.ac"
API_ROUTE = "/api/v1"

def main() -> None:
	now = datetime.datetime.now(datetime.UTC)

	r = requests.get(BASE_URL + API_ROUTE + "/games").json()
	if not r["success"]:
		return
	gpts = [(game, playtype)
		 for game in r["body"]["supportedGames"]
		 for playtype in r["body"]["configs"][game]["playtypes"]]

	i = (now.hour % 2 * 60 + now.minute) // 5
	if i >= len(gpts):
		return
	(game, playtype) = gpts[i]

	with open("users.json", mode="r", encoding="utf-8") as users_file:
		users = json.load(users_file)

	userdata = {"lastUpdate": now.timestamp() * 1000, "profiles": []}
	for user in users:
		user_id = user["id"]
		r = requests.get(BASE_URL + API_ROUTE + f"/users/{user_id}/games/{game}/{playtype}").json()
		if not r["success"]:
			continue
		profile = user.copy()
		profile["ratings"] = r["body"]["gameStats"]["ratings"]
		profile["classes"] = r["body"]["gameStats"]["classes"]
		profile["mostRecentScoreTimeAchieved"] = r["body"]["mostRecentScore"]["timeAchieved"]
		profile["totalScores"] = r["body"]["totalScores"]
		profile["rankingData"] = r["body"]["rankingData"]
		profile["playtime"] = r["body"]["playtime"]
		userdata["profiles"].append(profile)

	if userdata:
		userdata_dir = Path("../site/userdata")
		userdata_dir.mkdir(parents=True, exist_ok=True)
		with open(userdata_dir / f"{game}.json", mode="w", encoding="utf-8") as userdata_file:
			json.dump(userdata, userdata_file)

if (__name__ == "__main__"):
	main()