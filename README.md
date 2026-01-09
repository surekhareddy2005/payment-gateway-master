Here’s a **reworded version of your README** with the same meaning, cleaner flow, and fresh wording—perfect for submission or GitHub 👌
(Tech details and intent stay intact.)

---

# 💳 Multi-Method Payment Gateway with Hosted Checkout

A **fully containerized payment gateway application**, inspired by platforms such as Razorpay and Stripe.
This project showcases **complete payment workflows**, **merchant management**, and **hosted checkout integration**, built on a scalable backend system.

---

## 📌 Project Summary

This system provides a complete payment infrastructure that includes:

* Merchant registration and authentication
* Secure order generation and tracking
* Support for multiple payment methods (UPI & Cards)
* A hosted checkout page for customers
* A merchant dashboard with live transaction metrics

The primary focus of this project is on **backend API architecture**, **payment validation logic**, **transaction lifecycle handling**, and **frontend-backend integration**.

---

## ✨ Key Capabilities

### 🔐 Merchant Module

* Merchant login and authentication
* Access to API credentials
* Overview of total transactions
* Count of successful payments
* Automatic calculation of payment success rate
* Complete transaction history view

### 💰 Payment Processing

* UPI payments with VPA format validation
* Card-based payment flow
* Order-driven payment architecture
* Payment status management (success / failure)

### 🧾 Customer Checkout

* Hosted checkout interface
* Simple and intuitive payment method selection
* Secure linkage between orders and payments

---

## 🧱 Technology Stack

| Layer              | Tools Used             |
| ------------------ | ---------------------- |
| Backend            | Node.js, Express       |
| Database           | PostgreSQL             |
| Merchant Dashboard | HTML, CSS, JavaScript  |
| Checkout UI        | HTML, CSS, JavaScript  |
| Containerization   | Docker, Docker Compose |

---

## 🐳 Containerized Setup

All components are dockerized and can be launched together using **Docker Compose**, enabling a smooth local setup.

### 🔌 Services & Exposed Ports

| Service             | Port |
| ------------------- | ---- |
| Backend API         | 8000 |
| Merchant Dashboard  | 3000 |
| Hosted Checkout     | 3001 |
| PostgreSQL Database | 5432 |

---

## 🗄️ Database Structure

The application uses a relational PostgreSQL database with the following core tables:

* **Merchants**
* **Orders**
* **Payments**

### Schema Highlights

* Strong foreign key relationships
* Indexed fields for faster queries
* Automatic timestamps for audit tracking
* Transaction-safe payment records

---

## 🧪 Preloaded Test Merchant

For easy testing, a demo merchant account is automatically created when the system starts.

### 🔑 Merchant Dashboard Access

* URL: [http://localhost:3000/login.html](http://localhost:3000/login.html)
* Email: [test@example.com](mailto:test@example.com)
* Password: any value

---

## ▶️ Running the Application

### Requirements

* Docker
* Docker Compose

### Start All Services

```bash
docker-compose up
```

---

## 🧪 Testing the System

You can validate the system using multiple approaches:

### 🌐 Web Interface

* Merchant Dashboard
* Hosted Checkout Page

### 🔌 API Testing

* Postman
* curl

All APIs, validations, and payment scenarios are fully implemented according to the project specifications.

---

## ✅ Project Completion Status

✔ All required features implemented
✔ Backend APIs tested and verified
✔ Frontend interfaces fully functional
✔ Docker configuration validated
✔ Ready for evaluation and submission

---

## 👤 Author

**Surekha Reddy Gudimetla**

---

