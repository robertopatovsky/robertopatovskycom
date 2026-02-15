# Building a Robust Data Pipeline in Python

Data engineering is the backbone of modern analytics. Without reliable pipelines to move and transform data, the most sophisticated AI models are useless. In this tutorial, we will build a production-ready **ETL (Extract, Transform, Load)** pipeline using Python.

![Data Pipeline Architecture](/assets/data_pipeline_flow.png)

## What is a Data Pipeline?

A data pipeline is a series of steps that moves data from a source to a destination, often transforming it along the way. The classic pattern is **ETL**:

1.  **Extract**: Pulling raw data from APIs, databases, or files.
2.  **Transform**: Cleaning, aggregating, and structuring the data.
3.  **Load**: Saving the processed data into a data warehouse or database.

## Step 1: Ingestion (Extract)

Let's start by writing a robust ingestion script. We'll use the `requests` library to pull data from a hypothetical REST API.

```python
import requests
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)

def extract_data(api_endpoint):
    """
    Extracts data from a given API endpoint.
    """
    try:
        response = requests.get(api_endpoint)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Successfully extracted {len(data)} records.")
        return pd.DataFrame(data)
    except Exception as e:
        logging.error(f"Extraction failed: {e}")
        return pd.DataFrame()
```

## Step 2: Processing (Transform)

Raw data is rarely ready for analysis. It often contains null values, duplicates, or incorrect data types. Here we clean it using `pandas`.

```python
def transform_data(df):
    """
    Cleans and transforms the raw dataframe.
    """
    if df.empty:
        logging.warning("Empty dataframe received for transformation.")
        return df

    # 1. Remove duplicates
    df = df.drop_duplicates()

    # 2. Handle missing values
    df = df.fillna(method='ffill')

    # 3. Create new features
    # Example: specific logic to parse dates
    if 'timestamp' in df.columns:
        df['date'] = pd.to_datetime(df['timestamp'])

    logging.info("Data transformation complete.")
    return df
```

## Step 3: Storage (Load)

Finally, we load the clean data into a SQL database. We'll use `SQLAlchemy` for a clean, ORM-friendly approach.

```python
from sqlalchemy import create_engine

def load_data(df, db_connection_string, table_name):
    """
    Loads data into the target database.
    """
    if df.empty:
        logging.info("No data to load.")
        return

    engine = create_engine(db_connection_string)
    
    try:
        df.to_sql(table_name, engine, if_exists='append', index=False)
        logging.info(f"Successfully loaded {len(df)} records into {table_name}.")
    except Exception as e:
        logging.error(f"Load failed: {e}")
```

## Orchestration

In a real-world scenario, you wouldn't run this manually. tools like **Apache Airflow**, **Prefect**, or **Dagster** are used to schedule and monitor these pipelines.

However, for a simple script, a main block suffices:

```python
if __name__ == "__main__":
    API_URL = "https://api.example.com/data"
    DB_CONN = "sqlite:///warehouse.db"
    
    # Run the pipeline
    raw_df = extract_data(API_URL)
    clean_df = transform_data(raw_df)
    load_data(clean_df, DB_CONN, "sales_data")
```

## Conclusion

Building data pipelines is about reliability. By breaking your logic into distinct Extract, Transform, and Load steps, you create code that is easier to test, debug, and maintain.

In future posts, exploring how to dockerize this script and deploy it to the cloud.
