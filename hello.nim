import json

echo "Content-type: application/json\n"

var resp = %*{ "hello": "world"}

echo resp