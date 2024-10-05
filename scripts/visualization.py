import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap

# Load the cleaned flight routes CSV
flight_data_file = 'C:/Users/eliaf/OneDrive/TU Wien/3.Semester/Visualisierung 2/VU/Vis_data/data/cleaned/combined_data.csv'  # Replace with the path to your file
flight_data = pd.read_csv(flight_data_file)

# Create a new figure for the map
plt.figure(figsize=(12, 8))

# Set up the Basemap
m = Basemap(projection='mill',  # 'mill' is a Miller cylindrical projection
            llcrnrlat=-60, urcrnrlat=85,  # Latitude bounds
            llcrnrlon=-180, urcrnrlon=180,  # Longitude bounds
            resolution='l')

# Draw coastlines, countries, and map boundaries
m.drawcoastlines()
m.drawcountries()
m.drawmapboundary(fill_color='aqua')

# Fill continents and oceans with colors
m.fillcontinents(color='lightgray', lake_color='aqua')

# Loop through each row in the flight data and plot the routes
for index, row in flight_data.iterrows():
    source_lat, source_lon = row['Source Latitude'], row['Source Longitude']
    dest_lat, dest_lon = row['Destination Latitude'], row['Destination Longitude']
    
    # Convert source and destination coordinates to map projection coordinates
    source_x, source_y = m(source_lon, source_lat)
    dest_x, dest_y = m(dest_lon, dest_lat)
    
    # Plot the flight route as a line
    m.plot([source_x, dest_x], [source_y, dest_y], color='blue', linewidth=1)

# Add a title to the map
plt.title('Flight Routes')

# Show the plot
plt.show()
