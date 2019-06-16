This repository contains a description in both [french](https://github.com/stressGC/Food-Detection-Dataset/blob/master/README.fr.md) and [english](https://github.com/stressGC/Food-Detection-Dataset/blob/master/README.md).

# Food Recognition using Deep Learning

The main goal of this project is the recognition of food based on a picture of these. This project is a starter for a bigger project aiming to help diabetic people having an estimation of the glucides they are eating, based on a cellphone picture.

The source code of this project is available [there](https://github.com/stressGC/Food-Detection-Dataset).

# Useful ressources
- https://www.oreilly.com/ideas/object-detection-with-tensorflow
- http://androidkt.com/train-object-detection/
- https://github.com/datitran/raccoon_dataset
- https://medium.com/@WuStangDan/step-by-step-tensorflow-object-detection-api-tutorial-part-1-selecting-a-model-a02b6aabe39e
- https://cloud-annotations.github.io/training/object-detection/cli/index.html


# Work done

## Discovering the object detection world

### Discovery
- Searching for food datasets
- Documentation about various deep learning algorithms
- Understanding the [Food-101 dataset](https://www.vision.ee.ethz.ch/datasets_extra/food-101/)

### First experience
- Setting up a IBM Cloud Storage instance
- Upload a small subset on it
- Using the Cloud Annotation Tool on it
- Training a SSD MobileNet model on an IBM Cloud Computing instance
- Get the model back
- Install and configure a ReactJS app to test the model directly on the webcam

The subset was way too small to have good results. The detections were completely chaotic. Moreover, the choice to be able to detect food based on a video (or webcam) is not relevant, we don't need to sacrifice performance for calculus time on our use case.

## Creating a custom dataset

I extracted around 15 classes from the Food101 dataset, choosing those having a high chance of containing other classes in their images, so that I could avoid spending too much time scrapping and annotation time (ex: burger, ketchup and fries are often together !).

I scrapped Google Images to obtain custom classes data like "salad" using the download tool [Bulk Image Downloader](http://www.talkapps.org/bulk-image-downloader).

I obtained around 1900 images dispatched in 19 classes, therefore at least 100 images per class. I then [resized](https://github.com/stressGC/Food-Detection-Dataset/blob/master/image_resizer.py) these into a 250x250 pixels format.

![Classes](https://raw.githubusercontent.com/stressGC/Food-Detection-Dataset/master/report/number_of_classes.PNG?raw=true "Classes")

For the annotation, I used the [LabelImg](https://github.com/tzutalin/labelImg) tool, saving boundary boxes as PascalVOC format.

## Setting up an AWS GPU optimised instance

Following many problems in the setup and configuration of Tensorflow compiler on Windows, I decided to work on Linux. I ordered a virtual machine at Amazon Web Services, its type is g3.4xlarge, whoch is optimised for GPU computation (16 cores, 47 ECU, 122Gio memory). I then obtained a working environment.

## Formatting & splitting data

- Send the dataset to the remote server
```shell
scp -i <key_path> -r <user>@<server>:<remote_path> <local_path>
```
- [Conversion](https://github.com/stressGC/Food-Detection-Dataset/blob/master/voc_to_csv.py) of annotations from PascalVOC to CSV
```python
python voc_to_csv.py
```
- Writting a [splitting](https://github.com/stressGC/Food-Detection-Dataset/blob/master/label_test_train_split.py) script for train and test subsets
```python
python labels_test_train_split.py
```
- [Compiling](https://github.com/stressGC/Food-Detection-Dataset/blob/master/generate_tfrecord.py) the dataset into a tfrecord file, usable bu Tensorflow. This has to be done two times, for training and testing set.
```python
python generate_tfrecord.py
```
- Creating a [class map file](https://github.com/stressGC/Food-Detection-Dataset/blob/master/training/food_detection.pbtxt)

## Model

We are using the transfer learning method to initialise our model based on an already-trained model, saving a lot a time and pain.

We had the choice between lighter models and more accurate ones. I chose te second option following my first experience described above. The model used is [Inception v2](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) trained on the Coco dataset. I decided that time was not really a factor in my use case.

![Model Graph](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/model_graph.png?raw=true "Model Graph")

### Setup

- Clone the project from the TensorFlow GitHub
- Integrate to ours, and configure the [pipeline](https://github.com/stressGC/Food-Detection-Dataset/blob/master/training/inception_v2.config)

### Training

We can launch the training that way:
```python
python object_detection/model_main.py \
    --pipeline_config_path=training/inception_v2.config \
    --model_dir=<RESULT_MODEL_PATH>/ \
    --num_train_steps=<NUM_TRAIN_STEP> \
    --sample_1_of_n_eval_examples=1 \
    --alsologtostderr
```
![Terminal Screenshot](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/terminals_tensoflow_running.PNG?raw=true "Terminal Screenshot")

Let's supervise the training with TensorBoard (evaluation jobs): 

```python
# ssh into the server and tunnel the ports
ssh -L 127.0.0.1:<local_port>:127.0.0.1:<remote_port> <user>@<server>
# launch tensorboard
cd path/to/project
tensorboard log_dir=.
```
![Loss Tensorboard screenshot](https://github.com/stressGC/Food-Detection-Dataset/blob/master/report/global_loss.PNG?raw=true "Loss Tensorboard screenshot")

Finally lets save the model as a .pb file:
```python
python export_inference_graph.py 
    --input_type image_tensor 
    --pipeline_config_path training/inception_v2.config
    --trained_checkpoint_prefix <last_checkpoint_path>
    --output_directory <out_directory>
```

# Roadmap
- Conversion script to convert the model from a .pb file format to JSON, for it to be usable on the web
- Modify the demo app so we can test the new model on static image and not webcam 
- Make sure we chose the best fitting algorithm for our use case
- Optimise the chosen model
- Develop an API serving our model to the world
- Refactor the architecture of our project so that it is more clean
- Add classes to be recognised ?

# Conclusion

I encountered many difficulties to setup a working environment on Windows 10, moreover the custom dataset creation is a very boring and repetitive task.

I took a lot of pleasure setting up my own unique dataset, and to put it to pratice on a Deep Learning algorithm. Finally, despite many possible optimisations, the model has correct performances, and that makes me happy.

# Author
**Georges Cosson** : [LinkedIn](https://www.linkedin.com/in/georges-cosson/) - [GitHub](https://github.com/stressGC)

# Licence

MIT License, Copyright (c) 2019 G. Cosson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.