import skimage
from skimage import io, transform, img_as_ubyte

# TODO: check if exists, create if not
image_path = 'D:/Food Datasets/customDS/raw'
output_folder = 'D:/Food Datasets/customDS/resized/'

print('>>READING FOLDER : {}'.format(image_path))

#read images from the image path folder
coll = skimage.io.ImageCollection(image_path + '/*.jpg')

desired_height = 250
desired_width = 250
desired_format = [desired_height, desired_width]

print(">>RESIZING IMAGES", len(coll))

print_counter = 1

# resize all images
for i in range(len(coll)):
    print_counter+=1
    image = skimage.transform.resize(coll[i], desired_format)
    skimage.io.imsave(output_folder + 'resized_' + str(i) + '.jpg', image) # TODO remove warnings

    if (print_counter >= 100):
      print(str(i) + '/' + str(len(coll)))
      print_counter = 0

print('done')