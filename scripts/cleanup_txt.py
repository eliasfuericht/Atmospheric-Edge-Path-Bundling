# Open the input file and the output file
input_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/raw/airports_data.txt'  # Replace with the path to your .txt file
output_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/raw/cleaned_airports_data.csv'  # The output cleaned data as a CSV

# Open the input file for reading and the output file for writing
with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
    # Write the header to the output file
    outfile.write("Airport Code,Latitude,Longitude\n")
    
    # Process each line in the input file
    for line in infile:
        # Split the line by ':' (colon)
        parts = line.strip().split(':')
        
        # Extract the airport code (second part) and the latitude/longitude (last two parts)
        airport_code = parts[1]  # The code is between the first and second colon
        latitude = parts[-2]     # Second last part is latitude
        longitude = parts[-1]    # Last part is longitude
        
        # Convert latitude and longitude to floats
        latitude = float(latitude)
        longitude = float(longitude)
        
        # Check if the airport code is 'N/A' or if latitude or longitude is 0.000
        if airport_code != "N/A" and latitude != 0.000 and longitude != 0.000:
            # Write the cleaned data to the output file
            outfile.write(f"{airport_code},{latitude},{longitude}\n")

print(f"Cleaned data saved to {output_file}")
