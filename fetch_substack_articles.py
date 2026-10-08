#!/usr/bin/env python3
"""
Fetch Substack articles via a personal Cloudflare Worker proxy.

Why: Cloudflare blocks direct requests to hooshaai.substack.com from
Iranian IPs and GitHub Actions runners with a Managed Challenge
(cf-mitigated: challenge). The Worker runs on Cloudflare's own edge
network, so it is never blocked.

Behaviour on failure:
  - Network error  -> exit(1) WITHOUT touching the existing file.
  - Parse error    -> exit(1) WITHOUT touching the existing file.
  - Empty response -> exit(1) WITHOUT touching the existing file.
"""

import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

# 👇 Replace this with your actual Worker URL after deploying
WORKER_URL = "https://substack-proxy.YOUR-SUBDOMAIN.workers.dev"

OUTPUT_PATH = Path("src/data/substack_articles.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PortfolioSync/1.0)",
    "Accept": "application/xml, text/xml, */*",
}


def clean_html(raw):
    text = re.sub(r"<[^>]+>", "", raw or "")
    return re.sub(r"\s+", " ", text).strip()


def count_words(text):
    return len(re.findall(r"\w+", text or ""))


def to_iso(date_str):
    try:
        return parsedate_to_datetime(date_str).strftime("%Y-%m-%d")
    except Exception:
        return (date_str or "")[:10] or "2025"


def fetch_via_worker():
    print(f"Fetching via Cloudflare Worker: {WORKER_URL}")
    req = urllib.request.Request(WORKER_URL, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=45) as response:
        return response.read()


def parse_rss(xml_bytes):
    root = ET.fromstring(xml_bytes)
    articles = []

    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "Untitled Essay").strip()
        link = (item.findtext("link") or "https://hooshaai.substack.com").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        description = item.findtext("description") or ""

        content_el = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
        full_html = content_el.text if content_el is not None else description

        plain_text = clean_html(full_html)
        words = count_words(plain_text)
        read_time = max(1, round(words / 220))

        articles.append({
            "title": title,
            "url": link,
            "date": to_iso(pub_date),
            "desc": (plain_text[:280] + "...") if len(plain_text) > 280 else plain_text,
            "words": f"{words:,} words",
            "read": f"{read_time} min read",
            "full_html": full_html[:2000],
        })

    return articles


def main():
    try:
        xml_bytes = fetch_via_worker()
    except Exception as e:
        print(f"ERROR: Could not fetch from Worker: {e}", file=sys.stderr)
        print("Refusing to overwrite existing data.", file=sys.stderr)
        sys.exit(1)

    try:
        articles = parse_rss(xml_bytes)
    except Exception as e:
        print(f"ERROR: Could not parse RSS from Worker: {e}", file=sys.stderr)
        print("Refusing to overwrite existing data.", file=sys.stderr)
        sys.exit(1)

    if not articles:
        print("ERROR: Worker returned zero articles.", file=sys.stderr)
        sys.exit(1)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"Successfully wrote {len(articles)} articles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
