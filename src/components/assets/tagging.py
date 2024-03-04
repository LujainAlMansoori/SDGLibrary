import pandas as pd
from pdfminer.high_level import extract_text
import csv

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
    """Match keywords in text and return matching categories."""
    matched_categories = set()
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            if f" {keyword} " in text:
                matched_categories.add(category)
                break  # Stop searching this category if a keyword matches
    return matched_categories

def categorize_document(pdf_path, keywords_csv):
    """Determine the categories a PDF document belongs to based on keywords."""
    category_keywords = load_keywords(keywords_csv)
    text = extract_text_from_pdf(pdf_path)
    matched_categories = match_keywords(text, category_keywords)
    return matched_categories

# Example usage
pdf_path = "src/components/assets/Collected Materials/ActionAid/Education_vs_austerity_English_online_2.pdf"
keywords_csv = "src/components/assets/keywords.csv"
categories = categorize_document(pdf_path, keywords_csv)
print("Document belongs to categories:", categories)
