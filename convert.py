#!/bin/bash

"""
    Python program to convert images in a given folder/directory to another format supported by Pillow.
"""

from os import remove, walk
from PIL import Image, ImageOps


def format(foldername, ignore, fromtype=["png", "jpg", "jpeg"], totype="webp"):
    for folder, _, files in walk(foldername):
        for file in files:
            if file in ignore:
                continue

            extension = file.split(".")[-1]
            if extension.lower() in fromtype:
                # Convert
                print(f"Converting {file} to .webp")
                image = Image.open(f"{folder}/{file}")
                converted = ImageOps.exif_transpose(image)
                converted.save(f"{folder}/{file.rstrip(f'.{extension}')}.{totype}")

                # Delete previous file
                remove(f"{folder}/{file}")


if __name__ == "__main__":
    format("./public/assets/", ["signature.png"])
