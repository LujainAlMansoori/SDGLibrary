import requests
from pdfminer.high_level import extract_text
import csv
from collections import defaultdict
from io import StringIO, BytesIO

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

# Example usage with URLs
pdf_url = "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/documents%2FEducation_vs_austerity_English_online_2.pdf?alt=media&token=61c4bbcc-1737-4b1a-a7d9-c58f05d1b4b3"
keywords_csv_url = "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/keywords.csv?alt=media&token=3d65b7b6-31bc-4245-b777-30559570f050"
categories = categorize_document_from_urls(pdf_url, keywords_csv_url)

for category, details in categories:
    print(f"Category: {category}, Occurrences: {details['count']}, Matched Keywords: {', '.join(details['keywords'])}")


'''
curl -X POST \
  https://tag-pdf-dmyfoapmsq-uc.a.run.app \
  -H 'Content-Type: application/json' \
  -d '{
    "pdfUrl": "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/documents%2FEducation_vs_austerity_English_online_2.pdf?alt=media&token=880d1f28-c897-4f2d-9fd9-d46220f25748",
    "keywordsCsvUrl": "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/keywords.csv?alt=media&token=3d65b7b6-31bc-4245-b777-30559570f050"
  }'

'''