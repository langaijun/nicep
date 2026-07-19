import re
import sys
import os

# Map git bash /tmp to Windows temp
tmp = os.environ.get('TEMP', '/tmp')

files = {
    'Headspace Homepage': os.path.join(tmp, 'headspace.html'),
    'Headspace /meditation': os.path.join(tmp, 'hs_meditation.html'),
    'Headspace Article': os.path.join(tmp, 'hs_article.html'),
    'Calm Blog': os.path.join(tmp, 'calm_blog2.html'),
    'Calm Press': os.path.join(tmp, 'calm_press.html'),
    'Reflectly': os.path.join(tmp, 'reflectly.html'),
}

# Try both Windows and git bash paths
for name, path in list(files.items()):
    if not os.path.exists(path):
        alt = path.replace(os.environ.get('TEMP', ''), '/tmp')
        if os.path.exists(alt):
            files[name] = alt

for name, path in files.items():
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        print(f"\n{'='*60}")
        print(f"=== {name} ({len(content)} bytes) ===")
        print(f"{'='*60}")

        title = re.findall(r'<title[^>]*>(.*?)</title>', content, re.I | re.S)
        if title:
            print(f"Title: {title[0][:200]}")

        desc = re.findall(r'<meta[^>]*name=["\x27]description["\x27][^>]*content=["\x27](.*?)["\x27]', content, re.I)
        if not desc:
            desc = re.findall(r'<meta[^>]*content=["\x27](.*?)["\x27][^>]*name=["\x27]description["\x27]', content, re.I)
        if desc:
            print(f"Description: {desc[0][:250]}")

        canon = re.findall(r'<link[^>]*rel=["\x27]canonical["\x27][^>]*href=["\x27](.*?)["\x27]', content, re.I)
        if canon:
            print(f"Canonical: {canon[0]}")

        og = re.findall(r'<meta[^>]*property=["\x27]og:([^"\x27]+)["\x27][^>]*content=["\x27](.*?)["\x27]', content, re.I)
        if not og:
            og = re.findall(r'<meta[^>]*content=["\x27](.*?)["\x27][^>]*property=["\x27]og:([^"\x27]+)["\x27]', content, re.I)
            og = [(b,a) for a,b in og]
        for prop, val in og[:8]:
            print(f"  og:{prop}: {val[:150]}")

        tw = re.findall(r'<meta[^>]*name=["\x27]twitter:([^"\x27]+)["\x27][^>]*content=["\x27](.*?)["\x27]', content, re.I)
        for prop, val in tw[:5]:
            print(f"  twitter:{prop}: {val[:150]}")

        jsonld = re.findall(r'<script[^>]*type=["\x27]application/ld\+json["\x27][^>]*>(.*?)</script>', content, re.I | re.S)
        for j in jsonld[:2]:
            print(f"  JSON-LD: {j[:500]}")

        headings = re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', content, re.DOTALL | re.IGNORECASE)
        print(f"  Headings ({len(headings)} total):")
        for level, text in headings[:12]:
            clean = re.sub(r'<[^>]+>', '', text).strip()
            if clean:
                print(f"    H{level}: {clean[:120]}")

        hreflangs = re.findall(r'hreflang=["\x27]([^"\x27]+)["\x27]', content, re.I)
        if hreflangs:
            print(f"  Hreflang: {hreflangs[:10]}")

        links = re.findall(r'href=["\x27](/(?!/)[^"\x27]+)["\x27]', content)
        unique_links = sorted(set(links))
        print(f"  Internal links: {len(unique_links)} unique")
        cats = {}
        for l in unique_links:
            parts = l.strip('/').split('/')
            cat = parts[0] if parts[0] else 'root'
            cats[cat] = cats.get(cat, 0) + 1
        top_cats = sorted(cats.items(), key=lambda x: -x[1])[:10]
        for cat, count in top_cats:
            print(f"    /{cat}: {count}")

    except FileNotFoundError:
        print(f"  [File not found: {path}]")
    except Exception as e:
        print(f"  Error: {e}")
