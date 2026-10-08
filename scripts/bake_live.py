#!/usr/bin/env python3
"""
Bake live GitHub data into assets/data/live.json.
Stdlib only: urllib.request, json, os, sys, datetime.
"""

import datetime
import json
import os
import sys
import urllib.error
import urllib.request

LEVEL_MAP = {
    "NONE": 0,
    "FIRST_QUARTILE": 1,
    "SECOND_QUARTILE": 2,
    "THIRD_QUARTILE": 3,
    "FOURTH_QUARTILE": 4,
}


def fetch_json(url, headers, data=None):
    req = urllib.request.Request(url, headers=headers, data=data)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content)
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"HTTP error for {url}: {e.code} {e.reason}\n")
        sys.exit(1)
    except urllib.error.URLError as e:
        sys.stderr.write(f"URL error for {url}: {e.reason}\n")
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"Request failed for {url}: {e}\n")
        sys.exit(1)


def main():
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if not token:
        sys.stderr.write("Error: GITHUB_TOKEN environment variable is missing or empty.\n")
        sys.exit(1)

    common_headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "skf-profile-site-bake",
    }

    # Step 2: REST GET user
    user_url = "https://api.github.com/users/iamSH4NTO"
    user_data = fetch_json(user_url, headers=common_headers)

    # Step 3: REST GET repos
    repos_url = "https://api.github.com/users/iamSH4NTO/repos?per_page=100&sort=pushed&type=owner"
    raw_repos = fetch_json(repos_url, headers=common_headers)

    if not isinstance(raw_repos, list):
        sys.stderr.write(f"Unexpected response for {repos_url}: expected list\n")
        sys.exit(1)

    repos = [r for r in raw_repos if not r.get("fork", False)]
    stars = sum(r.get("stargazers_count", 0) for r in repos)

    # Step 4: GraphQL POST contributions
    graphql_url = "https://api.github.com/graphql"
    query_payload = json.dumps({
        "query": 'query{user(login:"iamSH4NTO"){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}'
    }).encode("utf-8")

    gql_headers = dict(common_headers)
    gql_headers["Content-Type"] = "application/json"

    gql_response = fetch_json(graphql_url, headers=gql_headers, data=query_payload)

    if "errors" in gql_response:
        sys.stderr.write(f"GraphQL error for {graphql_url}: {gql_response['errors']}\n")
        sys.exit(1)

    try:
        cal = gql_response["data"]["user"]["contributionsCollection"]["contributionCalendar"]
        total_contributions = cal["totalContributions"]
        weeks = cal.get("weeks", [])
    except (KeyError, TypeError) as e:
        sys.stderr.write(f"Invalid GraphQL response structure from {graphql_url}: {e}\n")
        sys.exit(1)

    flat_contributions = []
    for week in weeks:
        for day in week.get("contributionDays", []):
            level_str = day.get("contributionLevel", "NONE")
            flat_contributions.append({
                "date": day.get("date"),
                "count": day.get("contributionCount", 0),
                "level": LEVEL_MAP.get(level_str, 0),
            })

    # Step 5: Construct output
    iso_now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    output = {
        "generated_at": iso_now,
        "user": user_data,
        "stars": stars,
        "repos": repos,
        "contributions": {
            "total": {
                "lastYear": total_contributions
            },
            "contributions": flat_contributions
        }
    }

    # Write assets/data/live.json atomically
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(repo_root, "assets", "data")
    os.makedirs(target_dir, exist_ok=True)
    target_path = os.path.join(target_dir, "live.json")
    temp_path = os.path.join(target_dir, "live.json.tmp")

    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2)
            f.write("\n")
        os.replace(temp_path, target_path)
    except Exception as e:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
        sys.stderr.write(f"Failed to write live.json: {e}\n")
        sys.exit(1)

    # Step 6: Print one-line summary
    print(f"Baked live data: {len(repos)} repos, {total_contributions} contributions, {len(flat_contributions)} days")
    sys.exit(0)


if __name__ == "__main__":
    main()
