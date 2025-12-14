from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import os
import json
from pathlib import Path
from datetime import datetime
import uuid

router = APIRouter(prefix="/standards", tags=["standards"])

BASE = Path(__file__).resolve().parents[3] / 'web' / 'content' / 'standards'
COMMENTS_FILE = Path(__file__).resolve().parents[3] / 'data' / 'standards_comments.json'
COMMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)


def read_md(identifier: str):
    p = BASE / f"{identifier}.md"
    if not p.exists():
        raise HTTPException(status_code=404, detail="Not found")
    text = p.read_text(encoding='utf8')
    # split frontmatter
    if text.startswith('---'):
        parts = text.split('---', 2)
        meta = json.loads(json.dumps({}))
        # naive parse frontmatter: lines of key: value
        fm = parts[1].strip().splitlines()
        meta = {}
        for l in fm:
            if ':' in l:
                k, v = l.split(':', 1)
                meta[k.strip()] = v.strip()
        content = parts[2]
    else:
        meta = {}
        content = text
    return meta, content


@router.get("/{identifier}/json")
def get_json(identifier: str):
    meta, content = read_md(identifier)
    return JSONResponse({"id": identifier, "meta": meta, "content": content})


@router.get("/{identifier}/pdf")
def get_pdf(identifier: str):
    # generate basic PDF by writing a temporary file
    meta, content = read_md(identifier)
    # simple text-based PDF via reportlab if available
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
    except Exception:
        raise HTTPException(status_code=503, detail="PDF generation not available on server")

    out = COMMENTS_FILE.parent / f"{identifier}.pdf"
    c = canvas.Canvas(str(out), pagesize=letter)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(72, 720, meta.get('id', identifier))
    c.setFont("Helvetica", 10)
    lines = content.splitlines()
    y = 700
    for ln in lines:
        if y < 72:
            c.showPage()
            y = 720
        c.drawString(72, y, ln[:100])
        y -= 12
    c.save()
    return FileResponse(str(out), media_type='application/pdf', filename=f"{identifier}.pdf")


@router.get("/{identifier}/comments")
def get_comments(identifier: str):
    if COMMENTS_FILE.exists():
        data = json.loads(COMMENTS_FILE.read_text(encoding='utf8'))
    else:
        data = {}
    return data.get(identifier, [])


@router.post("/{identifier}/comments")
def post_comment(identifier: str, payload: dict):
    entry = {
        "id": str(uuid.uuid4()),
        "name": payload.get('name'),
        "email": payload.get('email'),
        "comment": payload.get('comment'),
        "created_at": datetime.utcnow().isoformat() + 'Z'
    }
    if COMMENTS_FILE.exists():
        data = json.loads(COMMENTS_FILE.read_text(encoding='utf8'))
    else:
        data = {}
    data.setdefault(identifier, []).append(entry)
    COMMENTS_FILE.write_text(json.dumps(data, indent=2), encoding='utf8')
    return JSONResponse(entry)
