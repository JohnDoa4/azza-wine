# -*- coding: utf-8 -*-
"""Копирует assets/images в versions/v1/assets/images с латинскими именами
и готовит оптимизированные фото бутылок (WebP) из docs/research/Вино фото.
Оригиналы не изменяются. Запуск: python build_assets.py
"""
import os, shutil, sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
SRC = os.path.join(ROOT, 'assets', 'images')
DST = os.path.join(ROOT, 'versions', 'v1', 'assets', 'images')
PHOTOS = os.path.join(ROOT, 'docs', 'research', 'Вино фото')
WINES_DST = os.path.join(ROOT, 'versions', 'v1', 'assets', 'wines')

COUNTRIES = {'Аргентина': 'argentina', 'Грузия': 'georgia', 'Испания': 'spain', 'Италия': 'italy',
             'Компас': 'compass', 'Молдова': 'moldova', 'Португалия': 'portugal', 'Украина': 'ukraine',
             'Франция': 'france', 'Чили': 'chile', 'ЮАР': 'south_africa', 'Южная Африка': 'south_africa',
             'Все страны': 'all'}
DISHES = {'Азиатская кухня': 'asian', 'без еды': 'any', 'Десерт': 'dessert', 'Закуски': 'snacks',
          'Красное мясо': 'red_meat', 'Морепродукты': 'seafood', 'мясо': 'meat', 'Овощи - салаты': 'veggies',
          'Паста - пицца': 'pasta', 'птица': 'poultry', 'Рыба': 'fish', 'Сыр': 'cheese'}
OCCASIONS = {'Без повода Для себя': 'none', 'В гости': 'visit', 'Вечеринка': 'party', 'Подарок': 'gift',
             'Праздник': 'holiday', 'Свидание': 'date', 'Ужин': 'dinner'}
HOME = {'Каталог вин': 'catalog', 'Подобрать вино': 'pick'}
COLORS = {'Белое': 'white', 'Игристое': 'sparkling', 'Красное': 'red', 'Не важно': 'any', 'Розовое': 'rose'}
FOLDERS = {'flag': ('flags', COUNTRIES), 'страны': ('countries', COUNTRIES), 'блюда': ('dishes', DISHES),
           'повод': ('occasions', OCCASIONS), 'сомелье': ('home', HOME), 'цвет': ('colors', COLORS)}


def copy_assets():
    n = 0
    shutil.copy2(os.path.join(SRC, 'logo.png'), os.path.join(DST, 'logo.png'))
    os.makedirs(os.path.join(DST, 'loader'), exist_ok=True)
    for f in os.listdir(os.path.join(SRC, 'loader')):
        shutil.copy2(os.path.join(SRC, 'loader', f), os.path.join(DST, 'loader', f.replace('-', '_')))
        n += 1
    for folder, (out, mapping) in FOLDERS.items():
        os.makedirs(os.path.join(DST, out), exist_ok=True)
        for f in os.listdir(os.path.join(SRC, folder)):
            key = f.replace('Property 1=', '').rsplit('.', 1)[0]
            if key not in mapping:
                print('SKIP (no mapping):', folder, f)
                continue
            shutil.copy2(os.path.join(SRC, folder, f), os.path.join(DST, out, mapping[key] + '.png'))
            n += 1
    print('copied', n, 'images')


def find_photo(filename):
    for d, _, fs in os.walk(PHOTOS):
        if filename in fs:
            return os.path.join(d, filename)
    return None


def optimize(src, dst, height=640):
    from PIL import ImageDraw, ImageFilter
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    opaque_bg = all(im.getpixel(c)[3] > 250 and min(im.getpixel(c)[:3]) > 225 for c in corners)
    if opaque_bg:  # фото на белом фоне: убираем фон заливкой от краёв
        for pt in corners + [(w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
            if im.getpixel(pt)[3] > 250 and min(im.getpixel(pt)[:3]) > 225:
                ImageDraw.floodfill(im, pt, (255, 255, 255, 0), thresh=40)
        a = im.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
        im.putalpha(a)
    bbox = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    if h > height:
        im = im.resize((max(1, round(w * height / h)), height), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=86, method=6)
    return im.size, opaque_bg


# slug -> исходное имя файла
WINES = {
    'ponte-merlot': 'wine ITA Ponte IGT Veneto Merlot.png',
    'carpineto-dogajolo': 'wine ITA Carpineto IGT Toscana Rosso Dogajolo.png',
    'camillo-pietraja': 'wine ITA Camillo DOC Montepulciano d-Abruzzo Pietraja.png',
    'paul-mas-cabernet': "wine FRA Paul Mas IGP Pays d'Oc Cabernet Sauvignon..png",
    'durujuli-saperavi': 'wine GEO Durujuli Saperavi red dry..png',
    'santa-julia-cabernet': '01 wine ARG Santa Julia Cabernet Sauvignon..png',
    'paul-mas-chardonnay': "wine FRA Paul Mas IGP Pays d'Oc Chardonnay..png",
    'carpineto-dogajolo-bianco': 'wine ITA Carpineto IGT Toscana Bianco Dogajolo.png',
    'paul-mas-rose': "wine FRA Paul Mas IGP Pays d'Oc Cote Mas Rose.png",
    'ponte-spumante': 'wine ITA Ponte Spumante Pinot-Chardonnay Brut.png',
}

if __name__ == '__main__':
    os.makedirs(DST, exist_ok=True)
    os.makedirs(WINES_DST, exist_ok=True)
    copy_assets()
    for slug, fn in WINES.items():
        p = find_photo(fn)
        if not p:
            print('MISSING photo:', fn)
            continue
        dst = os.path.join(WINES_DST, slug + '.webp')
        size = optimize(p, dst)
        print(slug, size, round(os.path.getsize(dst) / 1024), 'KB')
