# Checkpoint to PB file
## default config
```
python export_inference_graph \
    --input_type image_tensor \
    --pipeline_config_path path/to/ssd_inception_v2.config \
    --trained_checkpoint_prefix path/to/model.ckpt \
    --output_directory path/to/exported_model_directory
```
## my config
```
python export_inference_graph.py \
    --input_type image_tensor \
    --pipeline_config_path training/inception_v2.config \
    --trained_checkpoint_prefix resulting_model/model.ckpt-16980 \
    --output_directory clean_model
```

# model evaluation
```
python -m infer_detections --input_tfrecord_paths=../data/coco_testdev.record --output_tfrecord_path=../data/inference --inference_graph=../model/fine_tuned_model/frozen_inference_graph.pb --discard_image_pixels
```
```
python infer_detections.py --input_tfrecord_paths=data/test.record --output_tfrecord_path=data/inference --inference_graph=clean_model/frozen_inference_graph.pb
```

# pb to js convertion script
## default
```
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    /mobilenet/saved_model \
    /mobilenet/web_model
```
## mine
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    fine_tuned_model/frozen_inference_graph.pb json_output
```