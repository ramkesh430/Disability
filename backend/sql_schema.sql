CREATE DATABASE IF NOT EXISTS disability_id_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE disability_id_system;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_disability_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS master_severities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    municipality_name VARCHAR(255) NOT NULL DEFAULT 'अपाङ्गता परिचय-पत्र व्यवस्थापन प्रणाली',
    office_address VARCHAR(255) NULL,
    contact_phone VARCHAR(50) NULL,
    card_header_np VARCHAR(255) NOT NULL DEFAULT 'अपाङ्गता परिचय-पत्र',
    card_header_en VARCHAR(255) NOT NULL DEFAULT 'Disability Identity Card',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_no VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NULL,
    phone VARCHAR(20) NULL,
    citizenship_no VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    local_level VARCHAR(100) NULL,
    ward_no VARCHAR(20) NULL,
    disability_type VARCHAR(100) NULL,
    disability_severity VARCHAR(20) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Ward Review Pending',
    remarks TEXT NULL,
    photo_path VARCHAR(255) NULL,
    created_by INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS application_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ward_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE,
    review_status VARCHAR(50) NOT NULL,
    recommended_category VARCHAR(20) NULL,
    remarks TEXT NULL,
    reviewed_by INT NULL,
    reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ward_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_ward_user FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS committee_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE,
    decision VARCHAR(50) NOT NULL,
    final_category VARCHAR(20) NULL,
    remarks TEXT NULL,
    reviewed_by INT NULL,
    reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comm_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_comm_user FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS id_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL UNIQUE,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    card_type VARCHAR(20) NOT NULL,
    card_status VARCHAR(50) NOT NULL DEFAULT 'Generated',
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qr_code VARCHAR(100) NULL,
    CONSTRAINT fk_card_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS duplicate_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_card_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    remarks TEXT NULL,
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dup_card FOREIGN KEY (id_card_id) REFERENCES id_cards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NULL,
    user_id INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO master_severities (code, label) VALUES
('क', 'पूर्ण अशक्त'),
('ख', 'अति अशक्त'),
('ग', 'मध्यम अपाङ्गता'),
('घ', 'सामान्य अपाङ्गता');

INSERT IGNORE INTO system_settings (id, municipality_name, office_address, contact_phone, card_header_np, card_header_en)
VALUES (1, 'अपाङ्गता परिचय-पत्र व्यवस्थापन प्रणाली', 'Municipality Office', '9800000000', 'अपाङ्गता परिचय-पत्र', 'Disability Identity Card');

INSERT IGNORE INTO master_disability_types (name) VALUES
('शारीरिक अपाङ्गता'),
('श्रवण अपाङ्गता'),
('दृष्टि अपाङ्गता'),
('मानसिक अपाङ्गता'),
('बहु-अपाङ्गता');
