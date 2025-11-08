# Arctic Fisheries and Coastal Lagoons 
Geospatial analysis of Arctic coastal lagoons in Alaska using Python and Google Earth Engine (GEE) to monitor ecological changes such as algal blooms, ice coverage, and seasonal variation.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white" alt="Jupyter"/>
  <img src="https://img.shields.io/badge/Google_Earth_Engine-4285F4?style=for-the-badge&logo=google-earth&logoColor=white" alt="Google Earth Engine"/>
  <img src="https://img.shields.io/badge/ArcGIS-2C7AC3?style=for-the-badge&logo=arcgis&logoColor=white" alt="ArcGIS"/>
  <img src="https://img.shields.io/badge/ENVI-00A651?style=for-the-badge&logo=satellite&logoColor=white" alt="ENVI"/>
  <img src="https://img.shields.io/badge/GeoJSON-4EAA25?style=for-the-badge&logo=leaflet&logoColor=white" alt="GeoJSON"/>
</p>

## Project Overview
Climate change is reshaping Alaska’s fragile ecosystems, with warming weather driving seasonal shifts that threaten coastal habitats. William & Mary's Institute for Integrative Conservation (IIC) has partnered with the The Wildlife Conservation Society (WCS), which leads the Chukchi Sea Coastal Lagoon Monitoring project, to help provide insights to support researchers, conservationists, and local communities.

This project examines lagoons in the Chukchi and Beaufort Seas to determine ice coverage, lagoon connectivity, and algal growth. The code currently uploaded to this Github repository focuses mainly on algae bloom monitoring and analysis. Using the collected data, an interactive ArcGIS Experience Builder application was created to assist conservation specialists and fishermen in monitoring habitat changes and spotting long-term patterns.

Satellite imagery is processed by a Python workflow that makes use of the Google Earth Engine (GEE) API. The Normalized Difference Water Index (NDWI) is used to identify lagoon bodies, and the Normalized Difference Chlorophyll Index (NDCI) is used to evaluate algal blooms.  Selected satellite images are processed as GeoTIFFs for additional analysis in ArcGIS Pro, and time-series datasets are exported as CSVs.

As of September 2025, the project is still producing interactive mapping tools and satellite-derived datasets that are vital resources for tracking the health of ecosystems and guiding conservation plans in Arctic lagoons. Fore more visit the Expirenc Builder, or WCS site.

## Study Area
![Map of Arctic Coastal Lagoons](Maps/study_area_map.png)

<sub>*Map created by Isabella Buckley William & Mary '25*</sub>

## Meet the Team

<div align="center">

<table>
  <tr>
    <td align="center" width="33%">
      <img src="readme_files/isa_img.jpg" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Isabella Buckley"/>
      <br />
      <b>Isabella Buckley</b>
      <br />
      William & Mary '25
      <br />
      <a href="https://www.linkedin.com/in/isabella-buckley">
        <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
      </a>
    </td>
    <td align="center" width="33%">
      <img src="readme_files/jack_img.jpg" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Jack Zamary"/>
      <br />
      <b>Jack Zamary</b>
      <br />
      William & Mary '27
      <br />
      <a href="https://www.linkedin.com/in/jack-liam-zamary/">
        <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
      </a>
    </td>
    <td align="center" width="33%">
      <img src="readme_files/kevin_img.png" width="150" height="150" style="border-radius: 0px; object-fit: cover;" alt="Kevin Susnjar"/>
      <br />
      <b>Kevin Fraley</b>
      <br />
      Wildlife Conservation Society
      <br />
      <a href="https://www.linkedin.com/in/kevin-m-fraley-a87011ba/">
        <img src="https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn"/>
      </a>
    </td>
  </tr>
</table>

</div>

## Project Links

Visit the following links to learn more about the project and visualize some of the current data.

<p align="left">
  <a href="https://experience.arcgis.com/experience/8ed468e285634b5f974ba3df4b8ee857/">
    <img src="https://img.shields.io/badge/🗺️_Visualize_the_Data-Experience_Builder-0078D4?style=for-the-badge" alt="Visualize the Data"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://leucichthys.org/home/chukchi-sea-coastal-lagoon-monitoring/">
    <img src="https://img.shields.io/badge/📚_Learn_More-Arctic_Beringia_Fish_Ecology-2E8B57?style=for-the-badge" alt="Learn More"/>
  </a>
</p> 
