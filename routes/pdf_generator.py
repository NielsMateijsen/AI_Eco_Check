from flask import render_template, request, send_file
import pdfkit
import io
from app import app
import services.data_provider as dp

path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

@app.route('/pdf')
def generate_pdf():
  model_id = request.args.get('model_id')
  model_name = request.args.get('model_name')

  model_data = dp.find_model_details(model_id, model_name)
  model_data['training_emissions'] = pretty_print_emissions(get_train_emissions(model_data))
  # 3 decimals
  model_data['equivalent'] = get_train_emissions(model_data)

  if model_data['equivalent'] != 'N/A':
    model_data['equivalent'] = float(model_data['equivalent'])/2821
    model_data['equivalent'] = "{:.3f}L benzine".format(model_data['equivalent'])

  inference_value = 0
  if type(model_data["inference"]) != float and (model_data.get("inference") and "mean" in model_data["inference"]):
      inference_value = model_data["inference"]["mean"]
  elif model_data.get("inference"):
      inference_value = model_data["inference"]
  else:
      inference_value = 'N/A'

  model_data['inference_display'] = "N/A" if inference_value in ["Unknown", None] else inference_value

  reliability_title = ""
  reliability_text = ""

      
  if model_data.get("source") == 'HuggingFace' and model_data.get("emissions_available"):
      reliability_title = "Via HuggingFace"
      if type(model_data["emissions"]) == dict:
        source_value = model_data["emissions"].get("source", "Onbekende bron voor emissiegegevens")
      else:
        source_value = "Onbekende bron voor emissiegegevens"
      reliability_text = source_value
  
  elif model_data.get("inference_source") == 'Estimate' and model_data.get("inference_display") != 'N/A':
      reliability_title = "Onbekende bron"
      reliability_text = ("De werkelijke inferentiekosten zijn niet beschikbaar. "
                          "De huidige waarde is een schatting door de paper: "
                          "'Power Hungry Processing: Watts Driving the Cost of AI Deployment?'")

  elif model_data.get("source") == 'Intern' and model_data.get("emissions_available"):
      reliability_title = "In-house model"
      reliability_text = "Emissies zijn intern gerapporteerd."

  else:
      reliability_title = "Geen emissie brongegevens beschikbaar"
      reliability_text = ""

  model_data['reliability_title'] = reliability_title
  model_data['reliability_text'] = reliability_text

  
  
  tips = dp.get_tips(model_data['task'])

  data = {
    "model_data": model_data,
    "tips": tips
  }

  rendered_html = render_template('pdf_template.html', data=data)
  # css = ['templates/pdf_template.css']

  pdf = pdfkit.from_string(rendered_html, False, configuration=config)

  pdf_stream = io.BytesIO(pdf)

  return send_file(pdf_stream, download_name="model.pdf", as_attachment=True)

# @app.route('/pdf_template')
# def pdf_template():
#   model_id = request.args.get('model_id')
#   model_name = request.args.get('model_name')

#   model_data = dp.find_model_details(model_id, model_name)
#   model_data['training_emissions'] = pretty_print_emissions(get_train_emissions(model_data))
#   # 3 decimals
#   model_data['equivalent'] = float(get_train_emissions(model_data))/2821
#   model_data['equivalent'] = "{:.3f}L benzine".format(model_data['equivalent'])

#   inference_value = 0
#   if model_data.get("inference") and "mean" in model_data["inference"]:
#       inference_value = model_data["inference"]["mean"]
#   elif model_data.get("inference"):
#       inference_value = model_data["inference"]
#   else:
#       inference_value = 'N/A'

#   model_data['inference_display'] = "N/A" if inference_value in ["Unknown", None] else inference_value

#   reliability_title = ""
#   reliability_text = ""

#   if model_data.get("inference_source") == 'Estimate' and model_data.get("inference") != 'N/A':
#       reliability_title = "Onbekende bron"
#       reliability_text = ("De werkelijke inferentiekosten zijn niet beschikbaar. "
#                           "De huidige waarde is een schatting door de paper: "
#                           "'Power Hungry Processing: Watts Driving the Cost of AI Deployment?'")
      
#   elif model_data.get("source") == 'HuggingFace' and model_data.get("emissions_available"):
#       reliability_title = "Via HuggingFace"
#       if type(model_data["emissions"]) == dict:
#         source_value = model_data["emissions"].get("source", "Onbekende bron voor emissiegegevens")
#       else:
#         source_value = "Onbekende bron voor emissiegegevens"
#       reliability_text = source_value

#   elif model_data.get("source") == 'Intern' and model_data.get("emissions_available"):
#       reliability_title = "In-house model"
#       reliability_text = "Emissies zijn intern gerapporteerd."

#   else:
#       reliability_title = "Geen emissie brongegevens beschikbaar"
#       reliability_text = ""

#   model_data['reliability_title'] = reliability_title
#   model_data['reliability_text'] = reliability_text

  
  
#   tips = dp.get_tips(model_data['task'])

#   data = {
#     "model_data": model_data,
#     "tips": tips
#   }

#   return render_template('pdf_template.html', data=data)


def pretty_print_emissions(emission):
    try:
        emission = float(emission)
    except (ValueError, TypeError):
        return 'N/A g'
    
    if emission < 10:
        return f"{emission:.4f} g"
    elif emission < 1000:
        return f"{emission:.1f} g"
    elif emission < 1000000:
        return f"{emission / 1000:.2f} kg"
    else:
        return f"{emission / 1000000:.2f} mt"

def get_train_emissions(model):
    if not model.get("emissions_available", False):
        return 'N/A'
    elif model.get("emissions_is_dict", False):
        return f"{model['emissions']['emissions']:.3f}"
    else:
        return f"{model['emissions']:.3f}"
