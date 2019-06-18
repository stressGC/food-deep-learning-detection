Ce projet contient une description en [français](https://github.com/stressGC/Food-Detection-Dataset/blob/master/README.fr.md) et en [anglais](https://github.com/stressGC/Food-Detection-Dataset/blob/master/README.md).

# Reconnaissance d'aliments
## 8INF912 - Sujet Spécial en informatique, UQAC

Le but de ce projet est de reconnaitre les aliments d’une assiette à partir d’une photographie de ceux-ci. Il s’inscrit dans un cadre plus large visant à fournir un outil aux diabétiques leur permettant d’avoir une estimation des glucides de leur repas à partir d’une simple photographie depuis leur téléphone.

L’intégralité du code est disponible [ici](https://github.com/stressGC/Food-Detection-Dataset).

# Lien utiles
- https://www.oreilly.com/ideas/object-detection-with-tensorflow
- http://androidkt.com/train-object-detection/
- https://github.com/datitran/raccoon_dataset
- https://medium.com/@WuStangDan/step-by-step-tensorflow-object-detection-api-tutorial-part-1-selecting-a-model-a02b6aabe39e
- https://cloud-annotations.github.io/training/object-detection/cli/index.html


# Travail réalisé

## Découverte de la détection d'objets

### Découverte
- Recherche de datasets de nourriture et d'aliments
- Recherches et compréhension des différents algorithmes
- Familiarisation avec le dataset [Food-101](https://www.vision.ee.ethz.ch/datasets_extra/food-101/)

### Première expérience
- Mise en place d'une instance IBM Cloud Storage
- Upload d'une partie du dataset sur celle-ci
- Utilisation de l'outil Cloud Annotation Tool pour annoter ces images
- Entrainement d'un modèle SSD MobileNet sur une instance IBM Cloud Computing
- Récupération du modèle
- Installation et configuration d'une application ReactJS pour tester le résultat sur ma webcam

### Bilan

Le dataset était beaucoup trop petit pour avoir des résultats pertinents. De plus, le choix de pouvoir détecter les aliments à partir d'une vidéo (ou webcam) n'est pas pertinent, on n'a pas besoin de sacrifier la performance pour augmenter le temps de calcul.

## Création d'un dataset personnalisé

J'ai extrait environ 15 classes du dataset Food101, en choississant celles qui avaient beaucoup de chance de contenir d'autres classes dans leurs images, afin de gagner du temps de scrapping et de labelisation (ex: burger, ketchup et fries souvent ensemble). 

De plus, j'ai scrappé Google Images pour obtenir des classes personnalisées comme "salad", "ketchup" ou "bread" à l'aide de l'outil de téléchargement [Bulk Image Downloader](http://www.talkapps.org/bulk-image-downloader).

J'ai donc obtenu environ 1900 images pour 19 classes, soit plus ou moins 100 images par classe. J'ai ensuite [redimensionné](https://github.com/stressGC/Food-Detection-Dataset/blob/master/image_resizer.py) celles-ci en format 250x250 pixels.

![Classes](https://raw.githubusercontent.com/stressGC/Food-Detection-Dataset/master/report/number_of_classes.PNG?raw=true "Classes")

Annotation du dataset avec l'outil [LabelImg](https://github.com/tzutalin/labelImg) au format PascalVOC.

## Mise en place d'une VM AWS

Suite à de nombreux problèmes dans l'installation et configuration des outils de compilation de Tensorflow et de Python sous Windows, j'ai décidé de migrer sous Linux. J'ai donc mis en place une VM chez Amazon Web Services. VM de type g3.4xlarge, optimisée pour les calculs GPU (16 coeurs, 47 ECU et 122Gio de mémoire). Ensuite mise en place des dépendances et de Tensorflow.

## Formattage & Répartition des données

- Transfert du dataset vers l'instance AWS
```shell
scp -i <key_path> -r <user>@<server>:<remote_path> <local_path>
```
- [Convertion](https://github.com/stressGC/Food-Detection-Dataset/blob/master/voc_to_csv.py) des annotations du format PascalVOC vers un format CSV
```python
python voc_to_csv.py
```
- Mise en place d'un script de [séparation](https://github.com/stressGC/Food-Detection-Dataset/blob/master/label_test_train_split.py) des ensembles de test et d'entrainement
```python
python labels_test_train_split.py
```
- [Compilation](https://github.com/stressGC/Food-Detection-Dataset/blob/master/generate_tfrecord.py) du dataset en un fichier tfrecord, à réaliser deux fois pour les subsets d'entrainement et de test.
```python
python generate_tfrecord.py
```
- Création du [fichier de mappage des classes](https://github.com/stressGC/Food-Detection-Dataset/blob/master/training/food_detection.pbtxt)

## Modèle

On utilise la méthode du transfer learning pour initialiser notre modèle à partir d'un modèle pré-entrainé sur des énormes quantités de données.

Nous avons le choix entre les modèles "légers" et plus "approximatifs", et des modèles plus lents et "précis". J'ai choisi la seconde catégorie suite à ma première expérience décrite plus haut. Le modèle est [Inception v2](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) entrainé sur le dataset Coco. On a fait le choix de reconnaitre le bon aliment en plus de temps de calcul.

![Model Graph](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/model_graph.png?raw=true "Model Graph")

### Installation

- On clone le projet à partir du GitHub de Tensorflow
- On l'intègre à notre projet et on configure le [pipeline](https://github.com/stressGC/Food-Detection-Dataset/blob/master/training/inception_v2.config)

### Entrainement

On lance l'entrainement
```python
python object_detection/model_main.py \
    --pipeline_config_path=training/inception_v2.config \
    --model_dir=<RESULT_MODEL_PATH>/ \
    --num_train_steps=<NUM_TRAIN_STEP> \
    --sample_1_of_n_eval_examples=1 \
    --alsologtostderr
```
![Terminal Screenshot](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/terminals_tensoflow_running.PNG?raw=true "Terminal Screenshot")

On supervise l'entrainement avec TensorBoard (évaluation jobs). 

```python
# ssh into the server and tunnel the ports
ssh -L 127.0.0.1:<local_port>:127.0.0.1:<remote_port> <user>@<server>
# launch tensorboard
cd path/to/project
tensorboard log_dir=.
```
![Loss Tensorboard screenshot](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/global_loss.PNG?raw=true "Loss Tensorboard screenshot")


Enfin on sauvegarde le modèle en tant que fichier .pb.
```python
python export_inference_graph.py 
    --input_type image_tensor 
    --pipeline_config_path training/inception_v2.config
    --trained_checkpoint_prefix <last_checkpoint_path>
    --output_directory <out_directory>
```

### Export du model en JSON

Une fois le modèle exporté en format JSON, on obtient un dossier avec les éléments `model.json` (configuration du modèle), `group1-shardXofX.bin` (poids), `labels.json` (classes).

# Application Web

J'ai simplement ajouté les [fichiers statiques](https://github.com/stressGC/Food-Boundary-Box-Detection-Dataset/tree/master/models/food_detection) obtenus précedemment sur l'API de mon site personnel pour qu'ils soient disponibles de n'importe où. Cette API est developpée en TypeScript, grâce au framework NodeJS, sur un modèle similaire à [celui-là](https://github.com/stressGC/ExpressJS-TypeScript-Starter-Kit).


La partie client de l'application web est inspiré de ce [projet](https://github.com/cloud-annotations/object-detection-react). Je n'ai malheureusement pas réussi à faire marcher React avec mon modèle, suite à de nombreux problèmes sur le formattage des images et des tensors.

J'ai donc utilisé le modèle [MobileNet v2](https://github.com/tensorflow/models/tree/master/research/slim/nets/mobilenet) pré-entrainé par Tensorflow sur le dataset Coco.

L'application client est développé en ReactJS, elle permet de faire des prédictions avec ce modèle à partir de n'importe quelle image.

## Résultats

L'utilisateur peut charger une image depuis ses fichiers localement, où depuis des images pré-rentrées. Grâce à TensorflowJS, tous les calculs sont fait localement, aucune image n'est envoyée sur le serveur.

![Démo !](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/demo_predict?raw=true "Exemple de prédiction")

# Planification

- Mise en place d'une API servant notre modèle
- Refactor l'architecture du projet pour respecter les bonnes pratiques
- Ajouter des classes à reconnaitre

# Bilan

J'ai rencontré beaucoup de difficultés à mettre en place un environnement de travail sous Windows, de plus la création d'un dataset est un processus très long et répétitif.

J'ai pris beaucoup de plaisir à mettre en place un dataset unique, et à le coupler à un modèle de Deep Learning. De plus, malgré beaucoup d'optimisations possibles, le modèle reconnait déjà ses premières images.

# Author
**Georges Cosson** : [LinkedIn](https://www.linkedin.com/in/georges-cosson/) - [GitHub](https://github.com/stressGC)

# Licence

MIT License, Copyright (c) 2019 G. Cosson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.