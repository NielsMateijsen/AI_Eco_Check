import os
import importlib

# Get the directory of this file
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get all Python files in the current directory except __init__.py
views = [f for f in os.listdir(current_dir) if f.endswith(".py") and f != "__init__.py"]

# Import all files from the routes folder
for view in views:
    module_name = f'routes.{view[:-3]}'  # Correctly format the module name
    importlib.import_module(module_name)
    print(f'App imported {view} successfully.')
