-- Migration script to add missing fields to applications table
USE disability_id_system;

-- Add missing fields to applications table
ALTER TABLE applications 
ADD COLUMN province VARCHAR(100) NULL AFTER ward_no,
ADD COLUMN date_of_birth_ad VARCHAR(50) NULL AFTER disability_severity,
ADD COLUMN date_of_birth_bs VARCHAR(50) NULL AFTER date_of_birth_ad,
ADD COLUMN guardian_name VARCHAR(150) NULL AFTER date_of_birth_bs;

-- Update existing records with default values if needed
UPDATE applications SET 
    province = 'Province' WHERE province IS NULL,
    guardian_name = 'N/A' WHERE guardian_name IS NULL AND disability_severity IN ('A', 'B', 'C');

-- Add indexes for better performance
CREATE INDEX idx_applications_province ON applications(province);
CREATE INDEX idx_applications_dob_ad ON applications(date_of_birth_ad);
CREATE INDEX idx_applications_dob_bs ON applications(date_of_birth_bs);

-- Update application status to include new statuses for better workflow
ALTER TABLE applications MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Ward Review Pending';

-- Insert sample data for testing if needed
-- This section can be uncommented for testing purposes
/*
INSERT INTO applications (application_no, full_name, gender, phone, citizenship_no, district, local_level, ward_no, province, disability_type, disability_severity, date_of_birth_ad, date_of_birth_bs, guardian_name, status, remarks, created_by) 
VALUES 
('APP-2082-009', 'Test User', 'Male', '9876543210', '123456789', 'Kathmandu', 'Kathmandu Metropolitan City', '12', 'Bagmati Province', 'Physical Disability', 'A', '1990-01-01', '2046-09-17', 'Father Name', 'Committee Approved', 'Test application for migration', 1);
*/
