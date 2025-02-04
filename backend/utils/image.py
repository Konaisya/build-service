import os
from fastapi import UploadFile

def save_image(image: UploadFile, object_name: str) -> str:
    if object_name == 'house':
        save_path = f'images/house'
    elif object_name == 'apartment':
        save_path = f'images/apartment'

    os.makedirs(save_path, exist_ok=True)
    image_path = os.path.join(save_path, image.filename)

    with open(image_path, "wb") as f:
        f.write(image.file.read())
        
    return image_path