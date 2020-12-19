﻿# Test Technique Life Plus <!-- omit in toc -->

## Probleme
Dans une grille se trouvent des cellules actives ou inactives. L’exercice consiste à faire évoluer sur une grille un ensemble de cellules, génération après génération.
Selon les règles sont les suivantes :
● Une cellule morte possédant exactement trois voisines vivantes devient vivante.
● Une cellule vivante possédant deux ou trois voisines vivantes reste vivante, sinon elle meurt.

![alt text](https://github.com/TrieuBui1006/test-technique/blob/master/imgsResultats/lifePlus.PNG?raw=true)

## Resultats

Avec le fichier type de .txt suivi votre format demande:
```bash
30
11,1;12,1;10,2;9,3;9,4;9,5;10,6;11,7;12,7;2,4;1,5;2,5;18,28;17,28;19,27;20,26;20,25;20,24;19,23;18,22;17,22;27,25;28,24;27,24;11,28;12,28;10,27;9,26;9,25;9,24;10,23;11,22;12,22;2,25;1,24;2,24;18,1;17,1;19,2;20,3;20,4;20,5;19,6;18,7;17,7;27,4;28,5;27,5
```
Apres Importer
![alt text](https://github.com/TrieuBui1006/test-technique/blob/master/imgsResultats/exemple.PNG?raw=true)

A la 94eme generation, on obtient les resultats suivant:
![alt text](https://github.com/TrieuBui1006/test-technique/blob/master/imgsResultats/94eme.PNG?raw=true)

Avec le fichier d'exporter en format .txt:
```bash
30
10,4;10,5;10,24;10,25;11,4;11,5;11,12;11,13;11,16;11,17;11,24;11,25;12,12;12,13;12,16;12,17;14,5;14,6;14,23;14,24;15,5;15,6;15,23;15,24;17,12;17,13;17,16;17,17;18,4;18,5;18,12;18,13;18,16;18,17;18,24;18,25;19,4;19,5;19,24;19,25
```
