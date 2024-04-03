import os
from flask import Flask, request, jsonify, make_response, send_from_directory

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
  return 'Hello World'

if __name__ == '__main__':
  app.run()