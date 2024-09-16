# Findings

## Data availability
- 79.6% of models on HuggingFace with CO2 emissions tags have a more detailed CO2 info card listed on their model card (1692/2124). The others have only a value for their training emissions.

| Data Property     | Quantity | Availability (/1678) |
|-------------------|----------|----------------------|
| modelId           | 1678     | 100%                 |
| created_at        | 1678     | 100%                 |
| downloads         | 1678     | 100%                 |
| likes             | 1678     | 100%                 |
| emissions         | 1678     | 100%                 |
| training_type     | 1678     | 100%                 |
| model_type        | 1654     | 98,57%               |
| emissions_source  | 166      | 9,89%                |
| hardware          | 157      | 9,36%                |
| on_cloud          | 86       | 5,13%                |
| hours_used        | 86       | 5,13%                |
| cpu_model         | 86       | 5,13%                |
| ram_total_size    | 86       | 5,13%                |
| training_location | 78       | 4,65%                |
| energy_consumed   | 42       | 2,5%                 |
| author            | 0        | 0%                   |

### Different emission sources:
CodeCarbon computes CO2 emissions in real-time. MLCO2 after training. You can calculate the trainng emissions using MLCO2 if you have the following data:
- Hardware type
- Hours used for the hardware
- Provider
- Region of Compute

| Source                                   | Quantity | Percentage |
|------------------------------------------|----------|------------|
| CodeCarbon                               | 128      | 77,11%     |
| MLCO2                                    | 27       | 16,27%     |
| Paper                                    | 7        | 4,22%      |
| Google Colab                             | 3        | 1,81%      |
| Google   Cloud Platform Carbon Footprint | 1        | 0,6%       |
|                                          | **166**  | **100%**   |

## Training
Different training tools used for the models that might provide insight to emissions: AutoTrain from HuggingFace uses CodeCarbon 

## Evaluation
If there is evaluation data available, we can extract this from HuggingFace. But only 107/2124 models have evaluation results and 1659 evaluations in total (avg 15.50 per model). 


