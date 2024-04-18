import os
from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_cors import CORS;
import pandas
import numpy as np
import requests
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv('../canweteachthis/.env') # Load the environment variables
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
  return 'Hello World'

@app.route('/fetch_news_data', methods=['POST'])
def fetch_news_data():
  #check if the file exists
  print("Printing Request:")
  print(request.json)

  search_term = request.json['search_term']
  start_date = request.json.get('startDate', '2010-01-01')
  end_date = request.json.get('endDate', '2010-12-31')

  # print(search_term)
  # print(start_date)
  # print(end_date)
  
  if not search_term:
    return make_response(jsonify({'error': 'Search term is required'}), 400)
  
  if os.path.exists('./data/{search_term}_news_data.csv'):
    data = pandas.read_csv('./data/{search_term}_news_data.csv')
    return data.to_json()
  else:
    api_key = os.getenv('REACT_APP_NEWS_API_KEY')
    base_url = "https://newsapi.org/v2/"
    endpoint = "everything"

    params = {
    'q': search_term,  # Your search query 
    'from': start_date,  # Example start date
    'to': end_date,    # Example end date
    # 'sortBy': 'popularity',  # Sorting options: relevancy, popularity, publishedAt
    'apiKey': api_key
    }
    
    response = requests.get(base_url + endpoint, params=params)

    if response.status_code == 200:
      output = response.json()
      print(output.keys())
      articles = output['articles']
      print(articles[0].keys())
      year_counts = defaultdict(int)  
      for article in articles:
          published_at = article['publishedAt']
          year = published_at[:4]
          year_counts[year] += 1
      data = pandas.DataFrame(list(year_counts.items()), columns=['year', 'newsCount'])
      data.to_csv(f'./data/{search_term}_news_data.csv', index=False)
    elif response.status_code == 401: 
      return make_response(jsonify({'error': 'Invalid News API Key'}), 401)
    elif response.status_code == 429:
        return make_response(jsonify({'error': 'News API Rate Limit Exceeded'}), 429)
    else:
        print("Error:", response.status_code)
        return make_response(jsonify({'error': 'An unknown error occurred, API status code: {response.status_code}'}), 500)

  # return a json version of the data
  return data.to_json()

if __name__ == '__main__':
  app.run()