#!/usr/bin/env python3
import html
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "docs/data/example.xlsx"
OUTPUT = ROOT / "src/generated/productsFromExample.js"

NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
    "officeRel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def column_index(cell_ref):
    letters = re.sub(r"[^A-Z]", "", cell_ref.upper())
    total = 0
    for char in letters:
        total = total * 26 + ord(char) - ord("A") + 1
    return total - 1


def read_shared_strings(zf):
    path = "xl/sharedStrings.xml"
    if path not in zf.namelist():
        return []

    root = ET.fromstring(zf.read(path))
    values = []
    for item in root.findall("main:si", NS):
        parts = []
        for text in item.findall(".//main:t", NS):
            parts.append(text.text or "")
        values.append("".join(parts))
    return values


def read_workbook_sheets(zf):
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels.findall("rel:Relationship", NS)
    }

    sheets = []
    for sheet in workbook.findall("main:sheets/main:sheet", NS):
        rel_id = sheet.attrib[f"{{{NS['officeRel']}}}id"]
        target = rel_map[rel_id]
        if not target.startswith("xl/"):
            target = f"xl/{target}"
        sheets.append((sheet.attrib["name"], target))
    return sheets


def cell_text(cell, shared_strings):
    value = cell.find("main:v", NS)
    inline = cell.find("main:is/main:t", NS)
    if inline is not None:
        return inline.text or ""
    if value is None:
        return ""

    raw = value.text or ""
    if cell.attrib.get("t") == "s":
        try:
            return shared_strings[int(raw)]
        except (ValueError, IndexError):
            return ""
    return raw


def read_rows(zf, sheet_path, shared_strings):
    root = ET.fromstring(zf.read(sheet_path))
    for row in root.findall("main:sheetData/main:row", NS):
        values = []
        for cell in row.findall("main:c", NS):
            idx = column_index(cell.attrib.get("r", "A1"))
            while len(values) <= idx:
                values.append("")
            values[idx] = cell_text(cell, shared_strings).strip()
        yield values


def find_header(rows):
    for idx, row in enumerate(rows):
        normalized = [value.strip().lower() for value in row]
        if (
            "part code" in normalized
            and ("parts name" in normalized or "part name" in normalized)
            and "description" in normalized
        ):
            return (
                idx,
                normalized.index("part code"),
                normalized.index("parts name") if "parts name" in normalized else normalized.index("part name"),
                normalized.index("description"),
            )
    return None


def extract_products():
    products = []
    with zipfile.ZipFile(INPUT) as zf:
        shared_strings = read_shared_strings(zf)
        for sheet_name, sheet_path in read_workbook_sheets(zf):
            rows = list(read_rows(zf, sheet_path, shared_strings))
            header = find_header(rows)
            if header is None:
                continue
            header_row, code_col, name_col, desc_col = header
            for row in rows[header_row + 1 :]:
                code = row[code_col].strip() if code_col < len(row) else ""
                name = row[name_col].strip() if name_col < len(row) else ""
                description = row[desc_col].strip() if desc_col < len(row) else ""
                if not code and not name and not description:
                    continue
                if not code or not name:
                    continue
                products.append(
                    {
                        "id": len(products) + 1,
                        "code": code,
                        "name": name,
                        "description": description,
                    }
                )
    return products


def main():
    products = extract_products()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(products, ensure_ascii=False, indent=2)
    OUTPUT.write_text(
        "// Generated from docs/data/example.xlsx. Do not edit by hand.\n"
        f"// Source columns: Part Code, Parts Name, DESCRIPTION. Rows: {len(products)}.\n"
        f"export const products = {payload};\n",
        encoding="utf-8",
    )
    print(f"Generated {len(products)} products from {html.escape(str(INPUT.relative_to(ROOT)))}")


if __name__ == "__main__":
    main()
