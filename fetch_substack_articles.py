import urllib.request
import xml.etree.ElementTree as ET
import json
import re

SUBSTACK_RSS = "https://hooshaai.substack.com/feed"

def clean_html(raw_html):
    clean = re.sub(r'<[^>]+>', '', raw_html)
    return clean.strip()

def count_words(text):
    return len(re.findall(r'\w+', text))

print(f"Fetching RSS feed from {SUBSTACK_RSS}...")
try:
    req = urllib.request.Request(
        SUBSTACK_RSS,
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    )
    with urllib.request.urlopen(req) as response:
        rss_data = response.read()

    root = ET.fromstring(rss_data)
    articles = []

    for item in root.findall('./channel/item'):
        title = item.find('title').text if item.find('title') is not None else 'Untitled Essay'
        link = item.find('link').text if item.find('link') is not None else 'https://hooshaai.substack.com'
        pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ''
        description = item.find('description').text if item.find('description') is not None else ''
        content = item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
        full_html = content.text if content is not None else description

        plain_text = clean_html(full_html)
        words = count_words(plain_text)
        read_time = max(1, round(words / 220))

        articles.append({
            "title": title,
            "url": link,
            "date": pub_date[:16] if pub_date else "2026",
            "desc": plain_text[:280] + "..." if len(plain_text) > 280 else plain_text,
            "words": f"{words:,} words",
            "read": f"{read_time} min read",
            "full_html": full_html[:2000] # truncated excerpt preview
        })

    print(f"Successfully fetched {len(articles)} articles from Substack!")

    # Write to src/data/substack_articles.json
    with open("src/data/substack_articles.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print("Saved to src/data/substack_articles.json!")

except Exception as e:
    print(f"RSS Feed fallback: {e}")
    # Default fallback set if RSS is empty
    fallback_articles = [
        {
            "title": "Teaching Models to Decide When to Retrieve: Adaptive RAG, Part 4",
            "url": "https://hooshaai.substack.com/p/learning-to-retrieve",
            "date": "Oct 5, 2025",
            "desc": "Probing LLM uncertainty boundaries and training explicit retrieval decision heads using policy gradients.",
            "words": "7,573 words",
            "read": "22 min read"
        },
        {
            "title": "Probing LLMs' Knowledge Boundary: Adaptive RAG, Part 3",
            "url": "https://hooshaai.substack.com/p/probing-llms-knowledge-boundary",
            "date": "Sep 27, 2025",
            "desc": "Measuring internal logit entropy and epistemic confidence before issuing retrieval queries.",
            "words": "6,071 words",
            "read": "18 min read"
        },
        {
            "title": "Deciding When Not to Retrieve: Adaptive RAG, Part 2",
            "url": "https://hooshaai.substack.com/p/deciding-when-not-to-retrieve",
            "date": "Sep 21, 2025",
            "desc": "Evaluating latency overheads and token noise injected by unnecessary context retrieval.",
            "words": "2,242 words",
            "read": "9 min read"
        },
        {
            "title": "The Hidden Costs of Naive Retrieval: Adaptive RAG, Part 1",
            "url": "https://hooshaai.substack.com/p/problems-with-naive-rag",
            "date": "Sep 1, 2025",
            "desc": "Why static top-k vector retrieval fails on complex multi-hop reasoning tasks.",
            "words": "3,599 words",
            "read": "12 min read"
        },
        {
            "title": "Optimal Transport Straight Paths for Fast ODE Integration",
            "url": "https://hooshaai.substack.com/p/optimal-transport-flow-matching",
            "date": "Aug 4, 2025",
            "desc": "Deriving straight trajectory velocity fields to reduce ODE function evaluations from 50 to 15.",
            "words": "5,890 words",
            "read": "19 min read"
        },
        {
            "title": "Flow Matching vs Diffusion SDEs: Velocity Vector Fields",
            "url": "https://hooshaai.substack.com/p/flow-matching-vs-diffusion",
            "date": "Jul 12, 2025",
            "desc": "A continuous differential approach to generative modeling without stochastic noise schedules.",
            "words": "4,210 words",
            "read": "14 min read"
        },
        {
            "title": "Building a Math Reasoning Engine with GRPO Reinforcement",
            "url": "https://hooshaai.substack.com/p/grpo-unlocked-building-a-math-reasoning",
            "date": "Jul 19, 2025",
            "desc": "Group Relative Policy Optimization fine-tuning on GSM8K achieving 80.7% pass@1.",
            "words": "6,430 words",
            "read": "21 min read"
        }
    ]
    with open("src/data/substack_articles.json", "w", encoding="utf-8") as f:
        json.dump(fallback_articles, f, indent=2, ensure_ascii=False)
    print("Saved fallback articles to src/data/substack_articles.json!")
