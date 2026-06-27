#!/usr/bin/env python3
# ============================================================
#  Generador de CARTEL con QR para el "Quiz de Evento"
#  Toma una imagen (foto/diseño del cliente) y le añade un QR
#  que abre el juego, con llamada "Escanea y juega" + banderas.
#
#  Requisitos:  pip3 install segno pillow
#  Uso:
#     python3 generar_cartel.py FOTO.png  https://tu-juego.onrender.com  salida.png
#  Opcional (tapar texto de abajo desde una altura y extender):
#     python3 generar_cartel.py FOTO.png  URL  salida.png  --cover 1090
# ============================================================
import sys, os
import segno
from PIL import Image, ImageDraw, ImageFont

CREAM=(247,238,231); NAVY=(26,43,74); GOLD=(212,176,92)

def font(sz, bold=False):
    for p in [("/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold
               else "/System/Library/Fonts/Supplemental/Arial.ttf"),
              "/System/Library/Fonts/Helvetica.ttc"]:
        if os.path.exists(p):
            try: return ImageFont.truetype(p, sz)
            except Exception: pass
    return ImageFont.load_default()

def flag_es(d,x,y,w=82,h=54):
    d.rectangle([x,y,x+w,y+h],fill=(198,11,30))
    d.rectangle([x,y+h*0.25,x+w,y+h*0.75],fill=(255,196,0))
    d.rectangle([x,y,x+w,y+h],outline=(255,255,255),width=2)

def flag_se(d,x,y,w=82,h=54):
    d.rectangle([x,y,x+w,y+h],fill=(0,82,147))
    cx=x+int(w*0.30); d.rectangle([cx,y,cx+11,y+h],fill=(254,205,8))
    cyy=y+int(h*0.40); d.rectangle([x,cyy,x+w,cyy+11],fill=(254,205,8))
    d.rectangle([x,y,x+w,y+h],outline=(255,255,255),width=2)

def make_poster(src, url, out, cover_from=None, band=700):
    """cover_from: si se indica, recorta la imagen a esa altura (tapa el texto
       de abajo) y añade una banda crema con el QR. Si es None, añade la banda
       debajo de la imagen completa."""
    img=Image.open(src).convert("RGB"); W,H0=img.size
    if cover_from is None:
        cover_from=H0
    H=cover_from+band
    out_img=Image.new("RGB",(W,H),CREAM)
    out_img.paste(img.crop((0,0,W,cover_from)),(0,0))
    d=ImageDraw.Draw(out_img)
    d.rectangle([90,cover_from+34,W-90,cover_from+40],fill=GOLD)            # línea dorada
    # QR sobre tarjeta blanca (escanea mejor)
    qr=segno.make(url,error='h'); qp=out+".qr.tmp.png"
    qr.save(qp,scale=22,border=2,dark="#1a2b4a",light="white")
    qsz=470; q=Image.open(qp).convert("RGB").resize((qsz,qsz)); os.remove(qp)
    qx,qy=70,cover_from+100
    d.rounded_rectangle([qx,qy,qx+qsz+50,qy+qsz+50],radius=26,fill="white")
    out_img.paste(q,(qx+25,qy+25))
    # llamada + banderas (el idioma se elige dentro del juego)
    tx=qx+qsz+95; cy=qy+45
    d.text((tx,cy),"ESCANEA",font=font(62,True),fill=NAVY)
    d.text((tx,cy+72),"Y JUEGA",font=font(62,True),fill=GOLD)
    flag_es(d,tx,cy+190); flag_se(d,tx+102,cy+190)
    d.text((tx,cy+270),"Elige tu idioma",font=font(30),fill=NAVY)
    d.text((tx,cy+308),"al abrir el juego",font=font(30),fill=NAVY)
    cr="tu aliada · tualiada.es"; f=font(30,True); bb=d.textbbox((0,0),cr,font=f)
    d.text(((W-(bb[2]-bb[0]))/2,H-58),cr,font=f,fill=NAVY)
    out_img.save(out,quality=92)
    print("OK ->", out, out_img.size)

if __name__=="__main__":
    if len(sys.argv)<4:
        print("Uso: python3 generar_cartel.py FOTO.png URL salida.png [--cover Y]")
        sys.exit(1)
    src, url, out = sys.argv[1], sys.argv[2], sys.argv[3]
    cover=None
    if "--cover" in sys.argv:
        cover=int(sys.argv[sys.argv.index("--cover")+1])
    make_poster(src, url, out, cover_from=cover)
