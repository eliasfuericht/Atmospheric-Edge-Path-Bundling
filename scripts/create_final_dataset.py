import csv
import random

input_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis2_project/app/public/presentation.csv'
output_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis2_project/app/public/demo.csv'

try:
    with open(input_file, mode='r') as infile:
        reader = csv.reader(infile)
        data = list(reader)  # Read all rows into a list

    # Separate header from data
    header = data[0]
    rows = data[1:]

    # Ensure we don't select more rows than available
    num_samples = min(1000, len(rows))

    # Select random samples
    sampled_rows = random.sample(rows, num_samples)

    with open(output_file, mode='w', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)  # Write header row
        writer.writerows(sampled_rows)  # Write randomly selected rows

    print(f"Filtered data written to {output_file}")
except Exception as e:
    print(f"An error occurred: {e}")
