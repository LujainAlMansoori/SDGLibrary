import pandas as pd
from pdfminer.high_level import extract_text
import csv
from collections import defaultdict

def load_keywords(csv_path):
    """Load keywords from CSV and organize them by category."""
    category_keywords = {}
    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader, None)  # Skip the header
        for row in reader:
            category, keyword = row
            if category not in category_keywords:
                category_keywords[category] = []
            category_keywords[category].append(keyword.lower())
    return category_keywords

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF document using PDFMiner."""
    return extract_text(pdf_path).lower()

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

def categorize_document(pdf_path, keywords_csv):
    """Determine the categories a PDF document belongs to based on keywords, including matched keywords."""
    category_keywords = load_keywords(keywords_csv)
    text = extract_text_from_pdf(pdf_path)
    matched_categories = match_keywords(text, category_keywords)
    return matched_categories

# Example usage
pdf_path = "src/components/assets/Collected Materials/ActionAid/annual_report_2021_online.pdf"
keywords_csv = "src/components/assets/keywords.csv"
categories = categorize_document(pdf_path, keywords_csv)

for category, details in categories:
    print(f"Category: {category}, Occurrences: {details['count']}, Matched Keywords: {', '.join(details['keywords'])}")
