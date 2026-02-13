# Arctic Fisheries and Coastal Lagoons

[![Experience Builder](https://img.shields.io/badge/Experience_Builder-Visit-blue?logo=arcgis&logoColor=white)](https://experience.arcgis.com/experience/8ed468e285634b5f974ba3df4b8ee857/)
[![Research Website](https://img.shields.io/badge/WCS_Research_Website-Visit-green?logo=googlescholar&logoColor=white)](https://leucichthys.org/home/chukchi-sea-coastal-lagoon-monitoring/)

Geospatial analysis of Arctic coastal lagoons in Alaska using Python and Google Earth Engine (GEE) to monitor ecological changes such as algal blooms, ice coverage, connectivity, and seasonal variation.

## Project Overview

Climate change is reshaping Alaska’s fragile ecosystems, with warming weather driving seasonal shifts that threaten coastal habitats. William & Mary's Institute for Integrative Conservation (IIC) has partnered with the The Wildlife Conservation Society (WCS), which leads the Chukchi Sea Coastal Lagoon Monitoring project, to help provide insights to support researchers, conservationists, and local communities.

This project examines lagoons in the Chukchi and Beaufort Seas to determine ice coverage, lagoon connectivity, and algal growth. Using the collected data, an interactive ArcGIS Experience Builder application was created to assist conservation specialists and fishermen in monitoring habitat changes and spotting long-term patterns.

As of January 2026, the project is still producing interactive mapping tools and satellite-derived datasets that are vital resources for tracking the health of ecosystems and guiding conservation plans in Arctic lagoons. For more visit the [Experience Builder](https://experience.arcgis.com/experience/8ed468e285634b5f974ba3df4b8ee857/) Site, or WCS [Arctic Beringia Fish Ecology](https://leucichthys.org/) research site.

## A General Guide to What's Here

**Important files and their location:**

- The latest [notebook](Notebooks/Current/krusenstern_analysis_sp26.ipynb) has the complete workflow with basic visualization, validation datasets, and graphs to display the data. Check out the [requirements file](requirements.txt) to see what libraries are needed.

- Field collection data can be found in the [field collections folder](Data/field_collection/). These samples were collected starting in the summer of 2017 in various lagoon locations and were validated alongside Sentinel-2 Imagery.

- To access documentation and deliverables view the [deliverables folder](/Deliverables/).

**The archive:**

- The [archive](Notebooks/Archive/) folders holds all previous jupyter notebook files that were used in the past. This research has been ongoing for over four academic semesters (around 2 years) and older files can be found there.

**GEE Online:**

- Some basic data collection was done on the Google Earth Engine online editor in JavaScript. A current Earth Engine web-app is also under development and the code for those files can be found in the [GEE Online folder](/GEE-Online/).

## Study Area

![Map of Arctic Coastal Lagoons](Maps/study_area_map.png)

<sub>_Map created by Isabella Buckley William & Mary '25_</sub>

## Meet the Team

<div align="center">

<table>
  <tr>
    <td align="center" width="25%">
      <img src="readme_files/isa_img.jpg" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Isabella Buckley"/>
      <br />
      <b>Isabella Buckley</b>
      <br />
      William & Mary '25
      <br />
    </td>
    <td align="center" width="25%">
      <img src="readme_files/aayla_img.jpg" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Aayla Kastning"/>
      <br />
      <b>Aayla Kastning</b>
      <br />
      William & Mary '26
      <br />
    </td>
    <td align="center" width="25%">
      <img src="readme_files/jack_img.jpg" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Jack Zamary"/>
      <br />
      <b>Jack Zamary</b>
      <br />
      William & Mary '27
      <br />
    </td>
    <td align="center" width="25%">
      <img src="readme_files/kevin_img.png" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Kevin Fraley"/>
      <br />
      <b>Kevin Fraley</b>
      <br />
      WCS Ecologist
      <br />
    </td>
  </tr>
</table>

</div>

## Tools

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white" alt="Jupyter"/>
  <img src="https://img.shields.io/badge/Google_Earth_Engine-4285F4?style=for-the-badge&logo=google-earth&logoColor=white" alt="Google Earth Engine"/>
  <img src="https://img.shields.io/badge/ArcGIS-2C7AC3?style=for-the-badge&logo=arcgis&logoColor=white" alt="ArcGIS"/>
  <img src="https://img.shields.io/badge/ENVI-00A651?style=for-the-badge&logo=satellite&logoColor=white" alt="ENVI"/>
  <img src="https://img.shields.io/badge/GeoJSON-4EAA25?style=for-the-badge&logo=leaflet&logoColor=white" alt="GeoJSON"/>
</p>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
