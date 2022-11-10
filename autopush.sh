#!/bin/bash
echo "Commit message: "
read commit_message

python3 convert.py
git add .
git commit -m "$commit_message"
git push origin main --force
