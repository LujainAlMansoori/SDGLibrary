import csv
import os

def list_files(startpath):
    files_list = []
    
    for root, dirs, files in os.walk(startpath):
        # Skip the root directory by checking if it's the same as startpath
        if root == startpath:
            continue
        for file in files:
            # Get path relative to the startpath
            relative_path = os.path.relpath(os.path.join(root, file), startpath)
            # Append file name and relative path to list
            files_list.append([file, relative_path])
    
    return files_list

def write_to_csv(file_list, output_file='src/components/assets/files_list.csv'):
    # Sort the file list by the relative path (second item in each sublist)
    sorted_file_list = sorted(file_list, key=lambda x: x[1])
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['File Name', 'Relative Path'])
        csvwriter.writerows(sorted_file_list)

if __name__ == '__main__':
    start_path = 'src/components/assets/Collected Materials'  # Current directory
    files = list_files(start_path)
    write_to_csv(files)
