from flask import render_template
from weasyprint import HTML

rendered_html = render_template('pdf_template.html')
pdf = HTML(string=rendered_html).write_pdf()

with open('output.pdf', 'wb') as f:
    f.write(pdf)
