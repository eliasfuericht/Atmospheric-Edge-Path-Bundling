import pandas as pd

# Read the CSV file
input_file = 'C:/Users/eliaf/Desktop/routes.csv'  # Replace with the path to your CSV file
output_file = 'C:/Users/eliaf/Desktop/cleaned_flight_routes.csv'  # Output file after column removal

# Load the CSV file into a DataFrame
df = pd.read_csv(input_file)

# List of columns to drop
columns_to_drop = ["Airline", "Airline ID", "Source airport ID", "Destination airport ID", "Codeshare", "Stops", "Equipment"]

# Drop the specified columns
df_cleaned = df.drop(columns=columns_to_drop)

# Write the cleaned DataFrame to a new CSV file
df_cleaned.to_csv(output_file, index=False)

print(f"Cleaned data saved to {output_file}")
