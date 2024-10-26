from flask import render_template
import pdfkit
from app import app

path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

@app.route('/pdf')
def generate_pdf():
  rendered_html = render_template('pdf_template.html')
  css = ['templates/pdf_template.css']

  pdf = pdfkit.from_string(rendered_html, False, css=css, configuration=config)

  with open('output/output.pdf', 'wb') as f:
    f.write(pdf)

  return 'PDF Generated!'