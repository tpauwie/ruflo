#!/usr/bin/env python3
"""Check internal links (href/src) across the Jekyll site rooted at docs/.

Usage: python3 scripts/check-links.py
Exits non-zero and prints a report if any internal link is broken.
"""
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent / "docs"
ATTR_RE = re.compile(r'\b(?:href|src)\s*=\s*"([^"]+)"')


def is_external(url: str) -> bool:
    return bool(re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", url)) or url.startswith("//")


def resolve(html_file: Path, url: str) -> Path:
    path_part = urlsplit(url).path
    if path_part.startswith("/"):
        return ROOT / path_part.lstrip("/")
    return (html_file.parent / path_part).resolve()


def main() -> int:
    broken = []
    script_re = re.compile(r"<script\b[^>]*>.*?</script>", re.DOTALL | re.IGNORECASE)
    for html_file in sorted(ROOT.rglob("*.html")):
        text = html_file.read_text(encoding="utf-8", errors="ignore")
        text_no_scripts = script_re.sub("", text)
        for url in ATTR_RE.findall(text_no_scripts):
            url = url.strip()
            if not url or url.startswith("#") or url.startswith("mailto:") or url.startswith("tel:"):
                continue
            if is_external(url) or "${" in url:
                continue
            target = resolve(html_file, url)
            if not target.exists():
                broken.append((str(html_file.relative_to(ROOT)), url))

    if broken:
        print(f"Found {len(broken)} broken internal link(s):\n")
        for src, url in broken:
            print(f"  {src} -> {url}")
        return 1

    print(f"OK: checked {sum(1 for _ in ROOT.rglob('*.html'))} HTML files, no broken internal links.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
