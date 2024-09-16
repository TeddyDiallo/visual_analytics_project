import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('reduced_dataset.csv')
df = df.sample(1000)
df['avg_purchase_value'] = pd.to_numeric(df['avg_purchase_value'], errors='coerce')
df['age'] = pd.to_numeric(df['age'], errors='coerce')

age_grouped = df.groupby('age')['avg_purchase_value'].mean().reset_index()



bins = [10, 20, 30, 40, 50, 60, 70, 80, 90]  # Age ranges
labels = ['10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89']  # Bin labels

df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels)

#heatmap
df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels)
pivot_table = df.pivot_table(values='avg_purchase_value', index='age_group', aggfunc='mean')

# Plot the heatmap
plt.figure(figsize=(8, 6))  # Optional: Set figure size
sns.heatmap(pivot_table, annot=True, fmt='.0f', cmap='coolwarm', linewidths=0.5, cbar_kws={'label': 'Average Spending'})
plt.title('Average Spending by Age Group (Heatmap)')
#plt.xlabel('Age Group')
plt.ylabel('Age Group') 
plt.xticks(rotation=0)  
plt.yticks(rotation=0)
plt.show()

#Bar chart version 2
# age_grouped = df.groupby('age_group')['avg_purchase_value'].mean().reset_index()
# plt.bar(age_grouped['age_group'], age_grouped['avg_purchase_value'], color='skyblue')
# plt.title('Average Spending by Age Group')
# plt.xlabel('Age Group')
# plt.ylabel('Average Spending')
# plt.xticks(rotation=45)  # Rotate x-axis labels for readability
# plt.show()

# # Bar chart version 1
# plt.bar(age_grouped['age'], age_grouped['avg_purchase_value'], color='skyblue')
# plt.title('Average Spending by Age')
# plt.xlabel('Age')
# plt.ylabel('Average Spending')
# plt.xticks(rotation=45)
# plt.show()


# # Scatter plot
# plt.scatter(df['age'], df['avg_purchase_value'])
# plt.title('Spending by Age')
# plt.xlabel('Age')
# plt.ylabel('Spending')
# plt.show()
