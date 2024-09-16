import pandas as pd

# Function to clean up unclosed quotation marks
def clean_data(file_path, output_path):
    with open(file_path, 'r') as infile, open(output_path, 'w') as outfile:
        for line in infile:
            # Replace the problematic part
            cleaned_line = line.replace('"Yes\n"', '"Yes"')  # Example fix
            outfile.write(cleaned_line)

# Path to the input CSV file
input_file = 'reduced_dataset.csv'

# Path to the cleaned output CSV file
output_file = 'cleaned_output_file.csv'

# Clean the data
clean_data(input_file, output_file)

# Now read the cleaned data
df = pd.read_csv(output_file)
print(df.head())  # Check the data
