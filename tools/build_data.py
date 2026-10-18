# -*- coding: utf-8 -*-
"""Собирает js/data.generated.js: матрицы подбора из docs/research/engine-rules.txt
и выбранные вина из tools/data/wines_engine.csv (копия листа 01_Wines_Engine книги).
Запуск: python build_data.py            (10 вин)
        python build_data.py --all      (все 380 вин; фото нужны отдельно)
"""
import csv, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
RULES = os.path.join(ROOT, 'docs', 'research', 'engine-rules.txt')
CSV = os.path.join(HERE, 'data', 'wines_engine.csv')
OUT = os.path.join(HERE, '..', 'js', 'data.generated.js')

REGIONS = {'Veneto': 'Венето', 'Toscana': 'Тоскана', 'Abruzzo': 'Абруццо', 'Languedoc Roussillon': 'Лангедок',
           'Mendoza': 'Мендоса'}
COUNTRY_KEYS = {'Италия': 'italy', 'Франция': 'france', 'Грузия': 'georgia', 'Португалия': 'portugal', 'Чили': 'chile',
                'Испания': 'spain', 'Южная Африка': 'south_africa', 'Молдова': 'moldova', 'Аргентина': 'argentina',
                'Украина': 'ukraine'}
COLOR_KEYS = {'Красное': 'red', 'Белое': 'white', 'Розовое': 'rose', 'Игристое': 'sparkling'}

# имя в книге -> (slug, название для интерфейса, производитель, регион для показа)
SELECTED = {
    'wine ITA Ponte IGT Veneto Merlot': ('ponte-merlot', 'Ponte Merlot IGT Veneto', 'Ponte', 'Италия, Венето'),
    'wine ITA Carpineto IGT Toscana Rosso Dogajolo': ('carpineto-dogajolo', 'Carpineto Dogajolo Rosso Toscana IGT', 'Carpineto', 'Италия, Тоскана'),
    'wine ITA Camillo DOC Montepulciano d-Abruzzo Pietraja': ('camillo-pietraja', "Camillo Pietraja Montepulciano d'Abruzzo DOC", 'Camillo', 'Италия, Абруццо'),
    "wine FRA Paul Mas IGP Pays d'Oc Cabernet Sauvignon": ('paul-mas-cabernet', "Paul Mas Cabernet Sauvignon Pays d'Oc IGP", 'Domaines Paul Mas', 'Франция, Лангедок'),
    'wine GEO Durujuli Saperavi red dry': ('durujuli-saperavi', 'Durujuli Saperavi', 'Durujuli', 'Грузия'),
    '01 wine ARG Santa Julia Cabernet Sauvignon': ('santa-julia-cabernet', 'Santa Julia Cabernet Sauvignon', 'Santa Julia', 'Аргентина, Мендоса'),
    "wine FRA Paul Mas IGP Pays d'Oc Chardonnay": ('paul-mas-chardonnay', "Paul Mas Chardonnay Pays d'Oc IGP", 'Domaines Paul Mas', 'Франция, Лангедок'),
    'wine ITA Carpineto IGT Toscana Bianco Dogajolo': ('carpineto-dogajolo-bianco', 'Carpineto Dogajolo Bianco Toscana IGT', 'Carpineto', 'Италия, Тоскана'),
    "wine FRA Paul Mas IGP Pays d'Oc Cote Mas Rose": ('paul-mas-rose', "Paul Mas Côte Mas Rosé Pays d'Oc IGP", 'Domaines Paul Mas', 'Франция, Лангедок'),
    'wine ITA Ponte Spumante Pinot-Chardonnay Brut': ('ponte-spumante', 'Ponte Spumante Pinot-Chardonnay Brut', 'Ponte', 'Италия, Венето'),
}


def sheet(text, n):
    m = re.search(r'=== Sheet %d ===\n(.*?)(?=\n=== Sheet|\Z)' % n, text, re.S)
    return list(csv.reader(io.StringIO(m.group(1).strip())))


def matrices():
    text = open(RULES, encoding='utf-8').read()
    rows = sheet(text, 2)
    dishes = rows[0][4:]
    food = {}
    for r in rows[1:]:
        if len(r) > 4 and r[1] and r[4].strip().isdigit():
            food[r[1]] = {d: int(v) for d, v in zip(dishes, r[4:])}
    rows = sheet(text, 4)
    occs = rows[0][2:]
    occ = {}
    for r in rows[1:]:
        if len(r) > 2 and r[1] and r[2].strip().isdigit():
            occ[r[1]] = {o: int(v) for o, v in zip(occs, r[2:])}
    return {'food': food, 'occasion': occ, 'dishes': dishes, 'occasions': occs}


def wines(all_wines=False):
    out = []
    with open(CSV, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f):
            sel = SELECTED.get(r['name'])
            if not sel and not all_wines:
                continue
            slug, title, producer, region = sel if sel else (
                re.sub(r'[^a-z0-9]+', '-', r['name'].lower()).strip('-'), r['name'], '', REGIONS.get(r['region'], r['region']))
            out.append({
                'id': slug, 'name': title, 'producer': producer, 'country': r['country'],
                'countryKey': COUNTRY_KEYS.get(r['country'], ''), 'region': region, 'grape': r['grape'],
                'color': COLOR_KEYS[r['ui_color']], 'style': r['style'], 'sweetness': r['sweetness'],
                'body': int(r['body']), 'acidity': int(r['acidity']), 'tannin': int(r['tannin']),
                'aromatic': int(r['aromatic']), 'price': float(r['price']), 'stock': int(r['stock']),
                'popularity': float(r['popularity']), 'photo': 'assets/wines/%s.webp' % slug,
            })
    return out


if __name__ == '__main__':
    allw = '--all' in sys.argv
    data = {'matrices': matrices(), 'wines': wines(allw)}
    js = 'window.Azza = window.Azza || {};\nAzza.generated = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n'
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('/* Сгенерировано tools/build_data.py. Не править вручную. */\n' + js)
    print('wines:', len(data['wines']), 'styles:', len(data['matrices']['food']),
          'dishes:', len(data['matrices']['dishes']), 'occasions:', data['matrices']['occasions'])
