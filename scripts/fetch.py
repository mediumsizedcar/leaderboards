#!/usr/bin/env python

import datetime
import json
import requests
import sys
from pathlib import Path

BASE_URL = "https://kamai.tachi.ac"
API_ROUTE = "/api/v1"

NOW = datetime.datetime.now(datetime.UTC)
TIMESTAMP = NOW.timestamp() * 1000
CWD = Path(__file__).parent

def dump(users: list[dict[str, str]], game: str) -> None:
	userdata = {"lastUpdate": TIMESTAMP, "profiles": []}
	for user in users:
		user_id = user["id"]
		url = BASE_URL + API_ROUTE + f"/users/{user_id}/games/{game}"
		print(url)

		r = requests.get(url).json()
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
		userdata_dir_path = CWD.parent / "userdata"
		userdata_dir_path.mkdir(parents=True, exist_ok=True)
		userdata_file_path = userdata_dir_path / f"{game}.json"
		with open(userdata_file_path, mode="w", encoding="utf-8") as userdata_file:
			json.dump(userdata, userdata_file, indent="\t")
		print(f"\t{userdata_file_path}")

def main() -> None:
	r = requests.get(BASE_URL + API_ROUTE + "/games").json()
	if not r["success"]:
		return
	games = [game
		  for config in r["body"]["configs"].values()
		  for game in config["games"]]

	i = (NOW.hour % 2 * 60 + NOW.minute) // 5
	dump_all = len(sys.argv) > 1 and sys.argv[1].lower() == "all"

	if dump_all:
		pass
	elif i >= len(games):
		return
	else:
		game = games[i]

	with open(CWD / "users.json", mode="r", encoding="utf-8") as users_file:
		users = json.load(users_file)
	
	if dump_all:
		for g in games:
			dump(users, g)
	else:
		dump(users, game)

if (__name__ == "__main__"):
	main()