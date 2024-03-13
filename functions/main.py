from firebase_functions import https_fn
from firebase_admin import initialize_app, storage
import requests
from pdfminer.high_level import extract_text
import csv
from collections import defaultdict
from io import StringIO, BytesIO
import json
from flask_cors import cross_origin

# Initialize Firebase Admin SDK
initialize_app()

def load_keywords_from_url(csv_url):
    """Load keywords from a CSV URL and organize them by category."""
    response = requests.get(csv_url)
    response.raise_for_status()  # Ensure the request was successful
    csv_file = StringIO(response.content.decode('utf-8'))
    
    category_keywords = {}
    reader = csv.reader(csv_file)
    next(reader, None)  # Skip the header
    for row in reader:
        category, keyword = row
        if category not in category_keywords:
            category_keywords[category] = []
        category_keywords[category].append(keyword.lower())
    return category_keywords

def extract_text_from_pdf_url(pdf_url):
    """Extract all text from a PDF document using PDFMiner from a URL."""
    response = requests.get(pdf_url)
    response.raise_for_status()  # Ensure the request was successful
    pdf_file = BytesIO(response.content)
    return extract_text(pdf_file).lower()

def match_keywords(text, category_keywords):
    """Match keywords in text and return matching categories along with matched keywords."""
    category_matches = defaultdict(lambda: {'count': 0, 'keywords': set()})
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            occurrences = text.count(f" {keyword} ")
            if occurrences > 0:
                category_matches[category]['count'] += occurrences
                category_matches[category]['keywords'].add(keyword)
    
    # Sort categories by the number of keyword occurrences in descending order
    sorted_categories = sorted(category_matches.items(), key=lambda item: item[1]['count'], reverse=True)
    return sorted_categories

def categorize_document_from_urls(pdf_url, keywords_csv_url):
    """Determine the categories a PDF document belongs to based on keywords from URLs, including matched keywords."""
    category_keywords = load_keywords_from_url(keywords_csv_url)
    text = extract_text_from_pdf_url(pdf_url)
    matched_categories = match_keywords(text, category_keywords)
    return matched_categories

@https_fn.on_request()
@cross_origin()

def tag_pdf(req: https_fn.Request) -> https_fn.Response:
    request_json = req.get_json(silent=True)
    if not request_json or 'pdfUrl' not in request_json or 'keywordsCsvUrl' not in request_json:
        return https_fn.Response("Missing PDF URL or Keywords CSV URL", status=400)

    pdf_url = request_json['pdfUrl']
    keywords_csv_url = request_json['keywordsCsvUrl']
    
    try:
        categories = categorize_document_from_urls(pdf_url, keywords_csv_url)
        # Format the response as JSON
        formatted_result = {category: list(details['keywords']) for category, details in categories}
        return https_fn.Response(json.dumps(formatted_result), mimetype="application/json")
    except Exception as e:
        return https_fn.Response(f"Error processing document: {str(e)}", status=500)

