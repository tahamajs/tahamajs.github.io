#!/usr/bin/env python3
"""
Fetch the Substack RSS feed and write articles to src/data/substack_articles.json.

Behaviour on failure:
  - Network error  → exit(1) WITHOUT touching the existing file.
  - Parse error    → exit(1) WITHOUT touching the existing file.

This prevents an offline run from overwriting good data with a truncated
fallback list.
"""

import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

SUBSTACK_RSS = "https://hooshaai.substack.com/feed"
OUTPUT_PATH = Path("src/data/substack_articles.json")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*;q=0.1",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://hooshaai.substack.com/",
    "Cache-Control": "no-cache",
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


def fetch_rss():
    print(f"Fetching RSS feed from {SUBSTACK_RSS}...")
    req = urllib.request.Request(SUBSTACK_RSS, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as response:
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
        xml_bytes = fetch_rss()
    except Exception as e:
        print(f"ERROR: Could not fetch RSS feed: {e}", file=sys.stderr)
        print("Refusing to overwrite existing data on network error.", file=sys.stderr)
        sys.exit(1)

    try:
        articles = parse_rss(xml_bytes)
    except Exception as e:
        print(f"ERROR: Could not parse RSS: {e}", file=sys.stderr)
        print("Refusing to overwrite existing data on parse error.", file=sys.stderr)
        sys.exit(1)

    if not articles:
        print("ERROR: RSS feed returned zero items.", file=sys.stderr)
        sys.exit(1)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"Successfully wrote {len(articles)} articles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
