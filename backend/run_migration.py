#!/usr/bin/env python3
"""
Database migration script to add missing fields to applications table
"""

import pymysql
import sys
from urllib.parse import urlparse
from app.config import settings

def run_migration():
    connection = None
    try:
        # Parse DATABASE_URL
        parsed_url = urlparse(settings.DATABASE_URL)
        
        # Connect to MySQL server
        connection = pymysql.connect(
            host=parsed_url.hostname or 'localhost',
            port=parsed_url.port or 3306,
            user=parsed_url.username or 'root',
            password=parsed_url.password or '',
            database=parsed_url.path[1:],  # Remove leading slash
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        print("Starting database migration...")
        
        # Check and add each column individually
        columns_to_add = [
            ('province', "ALTER TABLE applications ADD COLUMN province VARCHAR(100) NULL AFTER ward_no"),
            ('date_of_birth_ad', "ALTER TABLE applications ADD COLUMN date_of_birth_ad VARCHAR(50) NULL AFTER disability_severity"), 
            ('date_of_birth_bs', "ALTER TABLE applications ADD COLUMN date_of_birth_bs VARCHAR(50) NULL AFTER date_of_birth_ad"),
            ('guardian_name', "ALTER TABLE applications ADD COLUMN guardian_name VARCHAR(150) NULL AFTER date_of_birth_bs")
        ]
        
        for column_name, query in columns_to_add:
            cursor.execute(f"SHOW COLUMNS FROM applications LIKE '{column_name}'")
            if not cursor.fetchone():
                print(f"Adding column: {column_name}")
                cursor.execute(query)
            else:
                print(f"Column '{column_name}' already exists. Skipping.")
        
        # Add indexes
        index_queries = [
            "CREATE INDEX idx_applications_province ON applications(province)",
            "CREATE INDEX idx_applications_dob_ad ON applications(date_of_birth_ad)",
            "CREATE INDEX idx_applications_dob_bs ON applications(date_of_birth_bs)"
        ]
        
        for query in index_queries:
            print(f"Executing: {query}")
            cursor.execute(query)
        
        # Update existing records
        update_queries = [
            "UPDATE applications SET province = 'Bagmati Province' WHERE province IS NULL",
            "UPDATE applications SET guardian_name = 'N/A' WHERE guardian_name IS NULL AND disability_severity IN ('A', 'B', 'C', 'D')"
        ]
        
        for query in update_queries:
            print(f"Executing: {query}")
            cursor.execute(query)
        
        connection.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        connection.rollback()
        sys.exit(1)
    finally:
        connection.close()

if __name__ == "__main__":
    run_migration()
