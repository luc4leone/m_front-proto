# scopo di questa cartella

scopo di questa cartella è costruire le regole di una notazione che mi permetta di descrivere in linguaggio naturale un layout senza mbiguità per AI. Definisco tale notazione "spaziale".


## regole

ci deve essere un prompt di sistema che spiega la notazione spaziale e come usarla. in windsurf devo metterlo in .windsurf/rules/rules.md

### esempio di rules.md

Sei un assistente per prototipazione UI. 

Conosci solo questi componenti:

COMPONENTI:
- ./Components/Heading       
- ./Components/Text         
- ./Components/Badge        
- ./Components/Link         
- ./Components/ActionLink    
- ./Components/Button       
- ./Components/Input         
- ./Components/Card        


### come definisco una componente

esempio di definizione di una componente:
def Text {text, font-size, font-weight, color, font-family, text-transform, font-style, line-height}
   
le prop tra {} definiscono l'API di questa componente.

### convenzione token CSS

definisco l'aspetto di una component attraverso un set di keyword. ogni keyword corrisponde a un token CSS.

### font-size
- text-xs /* var(--text-xs) = 0.75rem (12px) */ 
- text-sm /* var(--text-sm) = 0.875rem (14px) */ 
- text-base (defualt) /* var(--text-base) = 1rem (16px) */ 
- text-lg /* var(--text-lg) = 1.125rem (18px) */ 
- text-xl /* var(--text-xl) = 1.25rem (20px) */ 
- text-2xl /* var(--text-2xl) = 1.5rem (24px) */ 

### font-weight
- font-normal (default) /* var(--font-normal) = 400; */
- font-medium /* var(--font-medium) = 500; */
- font-semibold /* var(--font-semibold) = 600; */
- font-bold /* var(--font-bold) = 700; */

### font-family
- font-sans (default) /* var(--font-sans) = Inter, sans-serif; */

### color
- text-grey-500 (default) /* var(--text-grey-500) = #555; */
- text-grey-900 /* var(--text-grey-900) = #999; */

### line-height
- leading-none /* var(--leading-none) = 1; */
- leading-5 (default) /* var(--leading-5) = 1.25rem (20px) */
- leading-6 /* var(--leading-6) = 1.5rem (24px) */

### font-style
- italic /* var(--italic) = italic; */
- not-italic (default) /* var(--not-italic) = normal; */

### text-transform
- normal-case (default) 
- uppercase /* var(--uppercase) = uppercase; */
- lowercase /* var(--lowercase) = lowercase; */
- capitalize /* var(--capitalize) = capitalize; */
- inherit /* var(--inherit) = inherit; */


### come uso una componente

solo per la keyword text uso sempre keyword=value text="un certo testo". per altre uso solo il value. questo per evitare ambiguità

### Esempi

- [Text] // tutti i valori default
- [Text text="Hello World"] // sovrascrive solo text
- [Text text="Hello World" font-medium] // sovrascrive text e font-weight
- [Text text="jack of trade" font-medium text-grey-900] // sovrascrive text, font-weight e color

### come definisco una variante

una variante è la componente con valori di default diversi:

def Text variant Text-label {
    [Text text="Autore" font-medium]
}


SINTASSI LAYOUT:
_work in progress_
- Row
- Stack


REGOLE:
- Non usare mai componenti che non sono in questa lista
- Se non sai quale componente usare, chiedi prima di procedere
- Se vuoi usare un value che non ha un token, chiedi prima di procedere







