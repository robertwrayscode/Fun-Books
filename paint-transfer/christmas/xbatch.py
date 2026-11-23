"""Christmas book painter. usage: python xbatch.py jobs.json outdir [push_every]
Sends each job to the local Fun Books picture service (127.0.0.1:7861), saves JPGs,
and every push_every pictures commits + pushes outdir to the current git branch."""
import json, sys, time, subprocess, urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image
token = Path(r"C:\Users\Robert Wray\Documents\FunBooksPainting\engine\token.txt").read_text().strip()
jobs = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
every = int(sys.argv[3]) if len(sys.argv) > 3 else 80
repo = Path(__file__).resolve().parents[2]
def push(msg):
    for _ in range(4):
        try:
            subprocess.run(["git", "-C", str(repo), "add", str(out)], check=True)
            subprocess.run(["git", "-C", str(repo), "commit", "-q", "-m", msg], check=False)
            subprocess.run(["git", "-C", str(repo), "pull", "-q", "--no-rebase", "--no-edit"], check=False)
            r = subprocess.run(["git", "-C", str(repo), "push", "-q"], check=False)
            if r.returncode == 0: return
        except Exception as e: print("push error", e, flush=True)
        time.sleep(15)
n = 0; t0 = time.time()
for j in jobs:
    p = out / (j["name"] + ".jpg")
    if p.exists(): continue
    body = json.dumps({k: j[k] for k in ("prompt", "width", "height", "seed", "style") if k in j}).encode()
    for attempt in range(6):
        try:
            req = urllib.request.Request("http://127.0.0.1:7861/generate", data=body, headers={"Content-Type": "application/json", "X-Token": token})
            data = urllib.request.urlopen(req, timeout=900).read(); break
        except Exception as e:
            print("retry", j["name"], e, flush=True); time.sleep(20)
    else:
        print("FAILED", j["name"], flush=True); continue
    im = Image.open(BytesIO(data)).convert("RGB")
    w, h = im.size; cx, cy = int(w * 0.03), int(h * 0.04)
    im = im.crop((cx, cy, w - cx, h - cy))
    if "ow" in j:
        w, h = im.size; ta = j["ow"] / j["oh"]
        if w / h > ta: nw = int(h * ta); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else: nh = int(w / ta); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im = im.resize((j["ow"], j["oh"]), Image.LANCZOS)
    im.save(p, quality=90)
    n += 1
    print("done", j["name"], round((time.time() - t0) / n, 1), "s/pic", flush=True)
    if n % every == 0: push(f"Christmas pictures: {out.name} {n}")
push(f"Christmas pictures: {out.name} done")
print("ALL DONE", n, flush=True)
