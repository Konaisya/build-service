import os
from fastapi import UploadFile

def save_image(image: UploadFile) -> str:
    save_path = f"images"
    if not os.path.exists(save_path):
        os.makedirs(save_path)

    image_path = os.path.join(save_path, image.filename)
    with open(image_path, "wb") as f:
        f.write(image.file.read())
    
    return image.filename