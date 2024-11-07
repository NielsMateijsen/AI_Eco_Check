# AI Eco Check

**AI Eco Check** is a web application designed to analyze environmental impact and support sustainable practices for choosing an AI model. This project was developed as part of the **Joint Interdisciplinary Project** at **TU Delft** for the **Ministerie van Infrastructuur en Waterstaat**.

## Technologies Used

- **Backend**: Python, Flask, PostgreSQL
- **Frontend**: HTML, CSS, JavaScript

 [You can find the live web app here](https://aiecocheck.pythonanywhere.com)

## Install
How to install the AI Eco Check:
1. Clone the Git repository
2. Run `pip install -r requirements.txt`
3. Install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html)
4. Replace `path_wkhtmltopdf` in `routes/pdf_generator.py` to the executable install location (either Windows or Linux works)
5. Run `main.py`