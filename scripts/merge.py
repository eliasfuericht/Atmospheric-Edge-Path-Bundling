import pandas as pd

# Load the flight routes CSV
flight_routes_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/cleaned/flight_routes.csv'  # Replace with your file path
flight_routes_df = pd.read_csv(flight_routes_file)

# Load the airports data CSV
airports_data_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/cleaned/airports_data.csv'  # Replace with your file path
airports_data_df = pd.read_csv(airports_data_file)

# Rename the column in airports_data_df for easier merging
airports_data_df.rename(columns={'Airport Code': 'Airport'}, inplace=True)

# Merge to get the source airport latitude and longitude
merged_df = flight_routes_df.merge(airports_data_df, left_on='Source airport', right_on='Airport', how='left')
merged_df.rename(columns={'Latitude': 'Source Latitude', 'Longitude': 'Source Longitude'}, inplace=True)
merged_df.drop(columns=['Airport'], inplace=True)

# Merge to get the destination airport latitude and longitude
merged_df = merged_df.merge(airports_data_df, left_on='Destination airport', right_on='Airport', how='left')
merged_df.rename(columns={'Latitude': 'Destination Latitude', 'Longitude': 'Destination Longitude'}, inplace=True)
merged_df.drop(columns=['Airport'], inplace=True)

# Remove rows where either the source or destination latitude/longitude is missing (NaN)
cleaned_df = merged_df.dropna(subset=['Source Latitude', 'Source Longitude', 'Destination Latitude', 'Destination Longitude'])

# Save the cleaned data to a new CSV file
output_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/cleaned/cleaned_flight_routes.csv'  # Output file with lat/long data added
cleaned_df.to_csv(output_file, index=False)

print(f"Cleaned data saved to {output_file}")
