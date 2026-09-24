#!/usr/bin/env python3
"""Bundle the site into one self-contained HTML file (CSS, JS and images inlined).

Run as a PostToolUse hook after `git commit`; prints hook JSON asking Claude to
open the rebuilt preview. Run directly (`python3 .claude/hooks/build-preview.py`)
to just rebuild it.
"""
import base64, json, mimetypes, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "preview", "index.html")


def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    with open(path, "rb") as f:
        return f"data:{mime};base64,{base64.b64encode(f.read()).decode()}"


def read(name):
    with open(os.path.join(ROOT, name)) as f:
        return f.read()


def build():
    html = read("index.html")
    html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + read("styles.css") + "\n</style>")
    html = html.replace('<script src="script.js"></script>', "<script>\n" + read("script.js") + "\n</script>")
    # Inline every local asset that exists; missing ones (e.g. an unset hero.jpg) stay as-is.
    def inline(m):
        path = os.path.join(ROOT, m.group(0))
        return data_uri(path) if os.path.isfile(path) else m.group(0)
    html = re.sub(r"assets/[\w/.-]+\.(?:jpe?g|png|webp|gif|mp4)", inline, html)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write(html)


if __name__ == "__main__":
    if not sys.stdin.isatty():
        try:
            payload = json.load(sys.stdin)
        except ValueError:
            payload = {}
        # Only react to real commits, not e.g. `git commit --help` or a failed commit.
        if "git commit" not in payload.get("tool_input", {}).get("command", ""):
            sys.exit(0)
    build()
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": f"Site preview rebuilt at {OUT}. The user asked to open the site after every commit: send it to them now with SendUserFile (display: render).",
    }}))
