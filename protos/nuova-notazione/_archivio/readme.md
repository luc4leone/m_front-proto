# scopo di questa cartella

scopo di questa cartella è costruire le regole di una notazione che mi permetta di descrivere in linguaggio naturale un layout senza mbiguità per AI. Definisco tale notazione "spaziale".


## prompt di sistema

ci deve essere un prompt di sistema che spiega la notazione spaziale e come usarla.

- lista components
- tokens
- regole della notazione spaziale, con esempi

- l'aspetto estetico delle components è determinato dai tokens
- un sottoinsieme di tokens è largamente responsabile del tema grafico
- i blocchi hanno un'api che permette di cambiarne l'aspetto

- una componente può essere composta da altre componenti
- notazione componente: [nome-componente]


## come definisco una componente

def Text {
    tx: "lorem ipsum" (default),
    fs: 12, 14, 16 (default), 18, 20, 24, 30
    fw: 400 (default), 500, 600, 700
    color: grey-500 (default), grey-900
    ff: inter (default)
    tt: none (default), uppercase, lowercase, capitalize, inherit
    fst: normal (default), italic, oblique
    lh: 1.5 // non è nell'API, non è modificabile dall'esterno
}

api Text: tx, fs, fw, color, ff // seguono l'ordine di definizione

## convenzione token CSS

ogni valore corrisponde a un token CSS con la forma --[prop]-[valore]:
fs: 16 -> --fs-16
fw: 500 -> --fw-500
color: grey-500 -> --color-grey-500
ff: inter -> --ff-inter
lh: 1.5 -> --lh-1-5

## come uso una componente

[Text] // tutti i valori di default
[Text tx="Hello World"] // sovrascrive solo tx
[Text tx="Hello World" fw=500] // sovrascrive tx e fw
[Text "jack of trade" 16 400 grey-900 inter] // notazione posizionale: tutti i valori in ordine, senza key

## come definisco una variante

una variante è la componente con valori di default diversi:

def Text variant Text-label {
    [Text tx="Autore" fw=500]
}

## invece di key:value solo value a la tailwind

def Text {
    tx: "lorem ipsum" (default),
    fs: 12, 14, 16 (default), 18, 20, 24, 30
    fw: 400 (default), 500, 600, 700
    color: grey-500 (default), grey-900
    ff: inter (default)
    tt: none (default), uppercase, lowercase, capitalize, inherit
    fst: normal (default), italic, oblique
    lh: 1.5 // non è nell'API, non è modificabile dall'esterno
}

def Text {
    "lorem ipsum" (default), // text
    12, 14, 16 (default), 18, 20, 24, 30 // font-size
    400 (default), 500, 600, 700 // font-weight
    grey-500 (default), grey-900 // color
    inter (default) // font-family
    normal-case (default), uppercase, lowercase, capitalize, inherit // text-transform
    normal (default), italic, oblique // font-style
    leading-none,  // line-height (non è nell'API, non è modificabile dall'esterno)
}

definisco l'aspetto di una component attraverso un set di 

font-size
- text-xs /* var(--text-xs) = 0.75rem (12px) */ 
- text-sm /* var(--text-sm) = 0.875rem (14px) */ 
- text-base (defualt) /* var(--text-base) = 1rem (16px) */ 
- text-lg /* var(--text-lg) = 1.125rem (18px) */ 
- text-xl /* var(--text-xl) = 1.25rem (20px) */ 
- text-2xl /* var(--text-2xl) = 1.5rem (24px) */ 

font-weight
- font-normal (default) /* var(--font-normal) = 400; */
- font-medium /* var(--font-medium) = 500; */
- font-semibold /* var(--font-semibold) = 600; */
- font-bold /* var(--font-bold) = 700; */

font-family
- font-sans (default) /* var(--font-sans) = Inter, sans-serif; */

color
- text-grey-500 (default) /* var(--text-grey-500) = #555; */
- text-grey-900 /* var(--text-grey-900) = #999; */

line-height
- leading-none /* var(--leading-none) = 1; */
- leading-5 (default) /* var(--leading-5) = 1.25rem (20px) */
- leading-6 /* var(--leading-6) = 1.5rem (24px) */

font-style
- italic /* var(--italic) = italic; */
- not-italic (default) /* var(--not-italic) = normal; */

text-transform
- normal-case (default) 
- uppercase /* var(--uppercase) = uppercase; */
- lowercase /* var(--lowercase) = lowercase; */
- capitalize /* var(--capitalize) = capitalize; */
- inherit /* var(--inherit) = inherit; */

[Text "jack of trade" 16 400 grey-900 inter normal-case normal]
[Text "jack of trade" text-lg font-semibold]