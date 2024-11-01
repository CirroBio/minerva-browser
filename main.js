import SimpleEventHandler from "./simpleEventHandler.js"
import { get_links_alias } from "./links_alias.js"
import { nTex, toTileTarget, getGetTileUrl } from "./channel"
import { getAjaxHeaders } from "./state"
import { HashState } from "./state"
import { Render } from './render'
import { RenderOSD } from './osd'
import * as d3 from "d3"
import * as bootstrapSelect from 'bootstrap-select/dist/css/bootstrap-select.css'
import * as exhibitCss from './exhibit.css'

// Flatten an array of arrays
const flatten = function(items) {
  return items.reduce(function(flat, item) {
    return flat.concat(item);
  });
};

class Initializer {

  constructor(n_total_layers, hashstate, viewer) {
    this.n_total_layers = n_total_layers;
    this.hashstate = hashstate;
    this.viewer = viewer;
    this.n_loaded = 0;
  }

  init() {
    this.n_loaded += 1;
    const { hashstate, viewer } = this;
    if (this.n_loaded >= this.n_total_layers) {
      const eventHandler = new SimpleEventHandler(d3.select('body').node());
      const osd = new RenderOSD(hashstate, viewer, eventHandler);
      const render = new Render(hashstate, osd);
      osd.init();
      render.init();
    }
  }
}

// Arange openseadragon and initialize when done
const arrange_images = function(viewer, hashstate, init) {

  const grid = hashstate.grid;
  const grid_shape = to_grid_shape(grid);

  const images = hashstate.images;

  // If only one image, set image name to the first image description
  const imageName = hashstate.el.getElementsByClassName('minerva-imageName')[0];
  imageName.innerText = images.length == 1
    ? images[0].Description
    : hashstate.exhibit.Name

  // Read the grid arangement from the configuration file
  const { maxImageHeight, spacingFraction } = grid_shape;
  const { numRows, numColumns } = grid_shape;
  const { cellWidth, cellHeight } = grid_shape;

  const nTotal = numRows * numColumns * hashstate.layers.length;
  var nLoaded = 0;

  const aspect_ratio = (cellWidth * numColumns) / (cellHeight * numRows);
  hashstate.v = [hashstate.v[0], 0.5 * aspect_ratio, 0.5];

  // Iterate through the rows
  for (var yi = 0; yi < numRows; yi++) {
    const y = yi * (cellHeight + spacingFraction);
    // Iterate through the columns
    for (var xi = 0; xi < numColumns; xi++) {
      const image = grid[yi][xi];
      const { displayHeight, displayWidth } = to_image_shape(image, grid_shape)
      const x = xi * (cellWidth + spacingFraction) + (cellWidth - displayWidth) / 2;
      // Add the image title
      const titleElt = document.createElement('p');
      titleElt.className = 'minerva-overlay-title';
      const title = image.Description;
      titleElt.innerText = title;
      viewer.addOverlay({
        element: titleElt,
        x: x + displayWidth / 2,
        y: y,
        placement: 'BOTTOM',
        checkResize: false
      });
    }
  }
};

let marker_data = [{"﻿String":"ARL13B","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ARL13B&keywords=ARL13B"},{"﻿String":"ASMA","Alias":"A-SMA, a-SMA, alpha-SMA, α-SMA","Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ACTA2&keywords=alpha,smooth,muscle,actin"},{"﻿String":"BANF1","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=BANF1&keywords=BANF1"},{"﻿String":"CD11B","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ITGAM&keywords=CD11B"},{"﻿String":"CD14","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD14&keywords=CD14"},{"﻿String":"CD163","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD163&keywords=CD163"},{"﻿String":"CD19","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD19&keywords=CD19"},{"﻿String":"CD20","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=MS4A1&keywords=CD20"},{"﻿String":"CD21","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CR2&keywords=CD21"},{"﻿String":"CD3D","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD3D&keywords=CD3D"},{"﻿String":"CD4","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD4&keywords=CD4"},{"﻿String":"CD45","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=PTPRC&keywords=CD45"},{"﻿String":"CD45RB","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=PTPRC&keywords=CD45RB"},{"﻿String":"CD68","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD68&keywords=CD68"},{"﻿String":"CD8A","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD8A&keywords=CD8A"},{"﻿String":"FOXP3","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=FOXP3&keywords=FOXP3"},{"﻿String":"GFAP","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=GFAP&keywords=GFAP"},{"﻿String":"GTUBULIN","Alias":"gamma-tubulin","Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=TUBG1&keywords=gamma,tubulin"},{"﻿String":"IBA1","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=AIF1&keywords=IBA1"},{"﻿String":"KERATIN","Alias":"pan-cytokeratin, pan-keratin","Link":"https://www.genecards.org/Search/Keyword?queryString=KERATIN"},{"﻿String":"KI67","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=MKI67&keywords=KI67"},{"﻿String":"LAG3","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=LAG3&keywords=LAG3"},{"﻿String":"LAMINAC","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=LMNA&keywords=LAMIN,AC"},{"﻿String":"LAMINB","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=LMNB1&keywords=LAMINB"},{"﻿String":"PD-1","Alias":"PD1","Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=PDCD1&keywords=PD-1"},{"﻿String":"PD-L1","Alias":"PDL1","Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD274&keywords=PD-L1"},{"﻿String":"CD19","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD19&keywords=CD19"},{"﻿String":"CD14","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD14&keywords=CD11c"},{"﻿String":"CD56","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=NCAM1&keywords=CD56"},{"﻿String":"CD34","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD34&keywords=CD34"},{"﻿String":"CD44","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD44&keywords=CD34"},{"﻿String":"CD14","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD14&keywords=CD14"},{"﻿String":"CD33","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD33&keywords=CD33"},{"﻿String":"CD41","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ITGA2B&keywords=CD41"},{"﻿String":"CD61","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ITGB3&keywords=CD61"},{"﻿String":"CD62","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=SELP&keywords=CD62"},{"﻿String":"CD146","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=MCAM&keywords=CD146"},{"﻿String":"CD1d","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD1D&keywords=CD1d"},{"﻿String":"CD2","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD2&keywords=CD2"},{"﻿String":"CD5","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD5&keywords=cd5"},{"﻿String":"CD7","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD7&keywords=CD7"},{"﻿String":"CD9","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD9&keywords=CD9"},{"﻿String":"CD10","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=MME&keywords=CD10"},{"﻿String":"CD11A","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ITGAL&keywords=CD11A"},{"﻿String":"CD70","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD70&keywords=CD70"},{"﻿String":"CD74","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=CD74&keywords=CD74"},{"﻿String":"CD103","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=ITGAE&keywords=CD103"},{"﻿String":"CD133","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=PROM1&keywords=CD133"},{"﻿String":"CD168","Alias":null,"Link":"https://www.genecards.org/cgi-bin/carddisp.pl?gene=HMMR&keywords=CD168"}];
let cell_type_data = [{"﻿String":"Natural Killer Cells","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/natural-killer-cells"},{"﻿String":"B Cells","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/cells/b-cells"},{"﻿String":"Basophil","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/basophils"},{"﻿String":"Helper T cell","Alias":"CD4+ T Cell","Link":"https://www.immunology.org/public-information/bitesized-immunology/células/cd4-t-cells"},{"﻿String":"Cytotoxic T Cell","Alias":"CD8+ T Cell","Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/cd8-t-cells"},{"﻿String":"Dendritic Cell","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/cells/dendritic-cells"},{"﻿String":"Eosinophils","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/eosinophils"},{"﻿String":"Macrophage","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/macrophages"},{"﻿String":"Mast Cell","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/c%C3%A9lulas/mast-cells"},{"﻿String":"Neutrophil","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/cells/neutrophils"},{"﻿String":"Regulatory T Cell","Alias":"Treg","Link":"https://www.immunology.org/public-information/bitesized-immunology/células/regulatory-t-cells-tregs"},{"﻿String":"T follicular helper cell","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/cells/t-follicular-helper-cells"},{"﻿String":"bone marrow","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/%C3%B3rganos-y-tejidos/bone-marrow"},{"﻿String":"lymph node","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/organs-and-tissues/lymph-node"},{"﻿String":"complement system","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/sistemas-y-procesos/complement-system"},{"﻿String":"phagocytosis","Alias":null,"Link":"https://www.immunology.org/public-information/bitesized-immunology/systems-and-processes/phagocytosis"}];

const exhibitHTML = `
<div class="minerva-root">
    <div class="minerva-full">
        <div class="minerva-openseadragon"></div>
    </div>
    <div class="minerva-fixed">
        <div class="minerva-legend">
            <div class="legend-box">
                <div class="minerva-legend-grid bg-trans">
                  <div class="minerva-toggle-legend-panel">
                    <a class="minerva-toggle-legend" href="javascript;;">
                        <i class="minerva-open-legend fas fa-chevron-left" style="font-size: 25px;"></i>
                        <i class="minerva-close-legend fas fa-chevron-right" style="font-size: 25px;"></i>
                    </a>
                  </div>
                  <div class="minerva-channel-legend">
                    <ul class="minerva-channel-legend-1 list-unstyled m-0"></ul>
                    <ul class="minerva-channel-legend-2 list-unstyled m-0"></ul>
                    <ul class="minerva-channel-legend-3 list-unstyled m-0"></ul>
                  </div>
                  <div class="minerva-channel-legend-wrapper">
                    <ul class="minerva-channel-legend-info list-unstyled m-0"></ul>
                  </div>
                  <div class="minerva-channel-legend-info-icon disabled">
                    <div class="minerva-settings-icon">&#9432;</div>
                    <div class="minerva-settings-bar"></div>
                  </div>
                  <div class="minerva-channel-legend-color-picker"></div>
                  <div class="minerva-channel-legend-adding-panel">
                    <ul class="minerva-channel-legend-adding list-unstyled m-0 disabled"></ul>
                  </div>
                  <div class="minerva-channel-legend-adding-info-panel">
                    <ul class="minerva-channel-legend-adding-info list-unstyled m-0 disabled"></ul>
                  </div>
                  <div class="minerva-channel-legend-add-panel">
                    <div class="minerva-add-icon"></div>
                    <div class="minerva-add-bar"></div>
                  </div>
                </div>
            </div> 
            <div class="minerva-channel-groups-legend nav-pills p-2 bg-trans"
                 style="display:inline-block; vertical-align:top;
                 pointer-events: all; overflow-y: scroll; max-height: 80vh;">
            </div>
            <div class="minerva-z-slider-legend bg-trans"
                 style="pointer-events: all; display:inline-block; vertical-align:top;">
                 <input class="minerva-z-slider" type="range"/>
            </div>
            <div class="p-1 minerva-only-3d bg-trans">
              Depth:
              <div style="text-align: right;">
                <span class="minerva-depth-legend"> </span>
              </div>
            </div>
        </div>
        <div class="minerva-sidebar-menu container">
            <div class="row">
                <div class="col-11 bg-trans minerva-waypoint-content p-3" style="max-height: 80vh; overflow-y: scroll">
                    <div class="row">
                        <div class="col-10">
                            <h3 class="minerva-imageName m-0"></h3>
                        </div>
                        <div class="col-2">
                            <a class="btn text-light d-none minerva-home-button"
                                href="/">
                                <i class="fas fa-home"></i>
                            </a>
                            <a class="btn text-light d-none minerva-toc-button">
                                <i class="fas fa-list-ul"></i>
                            </a>
                        </div>
                    </div>
                    <hr class="my-1">
                    <div class="minerva-waypointControls row align-items-center my-1">
                        <div class="col-2 text-center minerva-leftArrow">
                            <i class="fas fa-arrow-left" style="font-size: 25px"></i>
                        </div>
                        <div class="col-8">
                          <div class="minerva-audioControls">
                            <audio style="height: 25px; width:100%" class="minerva-audioPlayback" controls>
                              <source class="minerva-audioSource" type="audio/mp3" src="">
                            </audio> 
                          </div>
                        </div>
                        <div class="col-2 text-center minerva-rightArrow">
                            <i class="fas fa-arrow-right" style="font-size: 25px;"></i>
                        </div>
                    </div>
                    <div class="row">
                        <div class="minerva-waypointName col-10 h6 mt-0 mb-3">
                        </div>
                        <div class="minerva-waypointCount col-2"></div>
                    </div>
                    <div class="minerva-viewer-waypoint">
                    </div>
                    <div>
                        <p class="minerva-channel-label mb-1 font-weight-bold pt-2">Select a marker group:</p>
                        <select class="minerva-group-picker minerva-editControls selectpicker" multiple>
                        </select>
                        <div class="minerva-channel-groups nav flex nav-pills"></div>
                        <div class="minerva-story-container"></div>
                        <p class="minerva-mask-label mb-1 font-weight-bold pt-2">Add data layer:</p>
                        <select class="minerva-mask-picker minerva-editControls selectpicker" multiple>
                        </select>
                        <div class="minerva-mask-layers nav flex nav-pills"></div>
                    </div>
                </div>
                <div class="col-1 p-0">
                    <div class="btn-group-vertical bg-trans"> 
                        <a class="minerva-toggle-sidebar btn" href="javascript;;">
                            <i class="minerva-close-sidebar fas fa-chevron-left" style="font-size: 25px;"></i>
                            <i class="minerva-open-sidebar fas fa-chevron-right" style="font-size: 25px;"></i>
                        </a>
                    </div> 
                    <div class="btn-group-vertical bg-trans">
                        <a class="btn text-light minerva-zoom-out" href="javascript;;">
                            <i class="fas fa-search-minus"></i>
                        </a>
                        <a class="btn text-light minerva-zoom-in" href="javascript;;">
                            <i class="fas fa-search-plus"></i>
                        </a>
                        <span class="nav-item minerva-arrow-switch">
                        <a class="btn" href="javascript:;">
                            <span class=""><i class="fas fa-location-arrow"></i></span>
                        </a>
                        </span>
                        <span class="nav-item minerva-lasso-switch">
                        <a class="btn" href="javascript:;">
                            <span class=""><i class="fas fa-bullseye"></i></span>
                        </a>
                        </span>
                        <span class="nav-item minerva-draw-switch">
                        <a class="btn" href="javascript:;">
                            <span class=""><i class="fas fa-crosshairs"></i></span>
                        </a>
                        </span>
                        <a class="btn minerva-duplicate-view">
                            <span class=""><i class="fas fa-clone"></i></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div class="d-none">
            <div class="minerva-arrow-overlay">
              <div class="minerva-arrowhead-image">
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>

    <svg
       xmlns:dc="http://purl.org/dc/elements/1.1/"
       xmlns:cc="http://creativecommons.org/ns#"
       xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns:svg="http://www.w3.org/2000/svg"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
       xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
       width="48"
       height="51.69223"
       viewBox="0 0 12.711991 13.676902"
       version="1.1"
       id="svg8"
       inkscape:version="0.92.2 5c3e80d, 2017-08-06"
       sodipodi:docname="arrowhead.svg">
      <defs
         id="defs2" />
      <sodipodi:namedview
         id="base"
         pagecolor="#ffffff"
         bordercolor="#666666"
         borderopacity="1.0"
         inkscape:pageopacity="0.0"
         inkscape:pageshadow="2"
         inkscape:zoom="2.8"
         inkscape:cx="215.21359"
         inkscape:cy="30.005484"
         inkscape:document-units="mm"
         inkscape:current-layer="layer1"
         showgrid="false"
         inkscape:window-width="1440"
         inkscape:window-height="855"
         inkscape:window-x="366"
         inkscape:window-y="127"
         inkscape:window-maximized="0"
         units="px"
         fit-margin-top="0"
         fit-margin-left="0"
         fit-margin-right="0"
         fit-margin-bottom="0">
        <inkscape:grid
           type="xygrid"
           id="grid93"
           originx="-80.574495"
           originy="-156.63291" />
        <inkscape:grid
           type="xygrid"
           id="grid3784"
           originx="-80.574495"
           originy="-156.63291" />
      </sodipodi:namedview>
      <metadata
         id="metadata5">
        <rdf:RDF>
          <cc:Work
             rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
               rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title></dc:title>
          </cc:Work>
        </rdf:RDF>
      </metadata>
      <g
         inkscape:label="Layer 1"
         inkscape:groupmode="layer"
         id="layer1"
         transform="translate(-80.487169,-126.68424)">
        <path
           style="fill:#000000;stroke:#ffffff;stroke-width:0.65998453;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
           d="m 90.862994,132.64086 1.759972,-5.27987 -11.439757,6.15985 11.439757,6.15987 -1.759972,-5.27988 c -0.185517,-0.55655 -0.185517,-1.20342 0,-1.75997 z"
           id="path91"
           inkscape:connector-curvature="0"
           sodipodi:nodetypes="scccss" />
      </g>
    </svg>

              </div>
              <div class="minerva-arrow-image">
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>

    <svg
       xmlns:dc="http://purl.org/dc/elements/1.1/"
       xmlns:cc="http://creativecommons.org/ns#"
       xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns:svg="http://www.w3.org/2000/svg"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
       xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
       width="122.79958"
       height="51.401581"
       viewBox="0 0 32.521399 13.600001"
       version="1.1"
       id="svg8"
       inkscape:version="0.92.2 5c3e80d, 2017-08-06"
       sodipodi:docname="arrow.svg">
      <defs
         id="defs2" />
      <sodipodi:namedview
         id="base"
         pagecolor="#ffffff"
         bordercolor="#666666"
         borderopacity="1.0"
         inkscape:pageopacity="0.0"
         inkscape:pageshadow="2"
         inkscape:zoom="3.959798"
         inkscape:cx="154.51108"
         inkscape:cy="29.572515"
         inkscape:document-units="mm"
         inkscape:current-layer="layer1"
         showgrid="false"
         inkscape:window-width="1440"
         inkscape:window-height="855"
         inkscape:window-x="0"
         inkscape:window-y="1"
         inkscape:window-maximized="1"
         units="px"
         fit-margin-top="0"
         fit-margin-left="0"
         fit-margin-right="0"
         fit-margin-bottom="0">
        <inkscape:grid
           type="xygrid"
           id="grid93"
           originx="-80.574492"
           originy="-156.63309" />
        <inkscape:grid
           type="xygrid"
           id="grid3784"
           originx="-80.574492"
           originy="-156.63309" />
      </sodipodi:namedview>
      <metadata
         id="metadata5">
        <rdf:RDF>
          <cc:Work
             rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
               rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title></dc:title>
          </cc:Work>
        </rdf:RDF>
      </metadata>
      <g
         inkscape:label="Layer 1"
         inkscape:groupmode="layer"
         id="layer1"
         transform="translate(-80.487168,-126.76104)">
        <path
           style="fill:#000000;stroke:#ffffff;stroke-width:0.6562736;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
           d="m 90.804653,132.6843 1.750076,-5.25019 -11.375434,6.12522 11.375434,6.12523 -1.750076,-5.25019 h 21.875777 v -1.75007 z"
           id="path91"
           inkscape:connector-curvature="0"
           sodipodi:nodetypes="cccccccc" />
      </g>
    </svg>

              </div>
              <div class="minerva-arrow-text">
                <div class="minerva-arrow-label p-3 bg-trans" style="max-width: 200px;">
                </div>
              </div>
            </div>

            <form class="form minerva-save_edits_form">
                <div class="input-group">
                    <div style="width: 100%; margin-bottom: 5px">
                        <input class="form-control minerva-edit_name bg-dark text-white rounded-0 border-0" type="text">
                        </input>
                        <br>
                        <textarea class="form-control minerva-edit_text bg-dark text-white rounded-0 border-0" rows="9">
                        </textarea>
                        <br>
                        <div class="row">
                            <div class="minerva-edit_toggle_arrow col-2 text-center">
                                <i class="fas fa-location-arrow"></i>
                            </div>
                            <div class="col-10">
                                <input class="form-control minerva-edit_arrow_text bg-dark text-white rounded-0 border-0" type="text">
                                </input>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-default minerva-edit_copy_button px-1" data-placement="bottom">
                        <i class="fas fa-copy fa-lg"></i><br>
                        <span class="mt-2 d-block" style="font-size: 0.7rem">
                                        COPY
                        </span>
                    </button>
                </div>
            </form>
        </div>


        <div class="minerva-password_modal modal fade" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Minerva Password</h2>
                    </div>
                    <div class="modal-body">

                        <form class="form">
                            <div class="form-group">
                                <input type=password class="form-control" name="p">
                            </div>
                            <button type="submit" class="btn btn-primary">Enter</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <div class="minerva-edit_description_modal modal fade" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content text-dark">
                    <div class="modal-header">
                        <h2 class="modal-title m-0 h5">Region of Interest</h2>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        <form class="form">
                            <div class="form-group text-bold">
                                <label> Enter a description for the selected region. </label>
                                <textarea class="form-control" name="d" rows="4"></textarea>
                            </div>
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Make Shareable Link</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="minerva-welcome_modal modal fade" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content text-dark">
                    <div class="modal-header">
                        <h2 class="modal-title m-0 h5">Welcome</h2>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="pb-2">
                          <span class="minerva-welcome-markers">
                            You're looking at an image layering
                            <span class="minerva-channel_count"></span>
                            markers.
                          </span>
                          <span class="minerva-welcome-nav">
                            Use the <i class="fas fa-arrow-left"></i>
                            and <i class="fas fa-arrow-right"></i>
                            arrows to move between highlighted image regions.
                            Click <i class="fas fa-list-ul"></i>
                            to return here to an overview of the full image.
                            Use <i class="fas fa-search-minus"></i> to zoom out
                            and <i class="fas fa-search-plus"></i> to zoom in.
                          </span>
                        </div>
                        <div>
                          <span class="minerva-welcome-tools">
                            To share your own highlighted image regions,
                            click <i class="fas fa-location-arrow"></i> to
                            point an arrow at a small feature,
                            click <i class="fas fa-bullseye"></i> to select
                            a feature with a custom shape, and
                            click <i class="fas fa-crosshairs"></i> to share a
                            boundary around a rectangular region.
                            Click <i class="fas fa-clone"></i> to open a
                            new window with shared navigation.
                          </span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="minerva-copy_link_modal modal fade" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content text-dark">
                    <div class="modal-header">
                        <h2 class="modal-title m-0 h5">Region of Interest</h2>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form">
                            <div class="input-group">
                                <input type="text" class="form-control minerva-copy_link" name="copy_content" placeholder="Some path">
                                <span class="input-group-btn">
                                    <button class="btn btn-default minerva-modal_copy_button" type="submit" data-toggle="tooltip" data-placement="bottom">
                                        Copy
                                    </button>
                                </span>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="minerva-all-overlays d-none">
        </div>
    </div>
</div>
`

const makeTwinViewer = function(e) {
    var youngerWindow = window.open(window.location.href);
    var viewer1 = window.viewer;
    var viewer2;
    youngerWindow.addEventListener('DOMContentLoaded', (e) => {
        viewer2 = youngerWindow.viewer;
        var viewer1Leading = false;
        var viewer2Leading = false;

        var viewer1Handler = function() {
        if (viewer2Leading) {
            return;
        }

        viewer1Leading = true;
        viewer2.viewport.zoomTo(viewer1.viewport.getZoom());
        viewer2.viewport.panTo(viewer1.viewport.getCenter());
        viewer1Leading = false;
        };

        var viewer2Handler = function() {
        if (viewer1Leading) {
            return;
        }

        viewer2Leading = true;
        viewer1.viewport.zoomTo(viewer2.viewport.getZoom());
        viewer1.viewport.panTo(viewer2.viewport.getCenter());
        viewer2Leading = false;
        };

        viewer1.addHandler('zoom', viewer1Handler);
        viewer2.addHandler('zoom', viewer2Handler);
        viewer1.addHandler('pan', viewer1Handler);
        viewer2.addHandler('pan', viewer2Handler);
    });
}

const to_image_shape = (image, grid_shape) => {
  const {
    numRows, maxImageHeight, spacingFraction
  } = grid_shape;

  const displayHeight = (1 - (numRows-1) * spacingFraction) / numRows * image.Height / maxImageHeight;
  const displayWidth = displayHeight * image.Width / image.Height;
  return { displayWidth, displayHeight }
}

const to_grid_shape = (grid) => {

  const numRows = grid.length;
  const numColumns = grid[0].length;
  const spacingFraction = 0.05;

  const maxImageWidth = flatten(grid).reduce(function(max, img) {
    return Math.max(max, img.Width);
  }, 0);
  const maxImageHeight = flatten(grid).reduce(function(max, img) {
    return Math.max(max, img.Height);
  }, 0);

  const cellHeight = (1 + spacingFraction) / numRows - spacingFraction;
  const cellWidth = cellHeight * maxImageWidth / maxImageHeight;
  return {
    numRows, numColumns, cellWidth, cellHeight, maxImageHeight, spacingFraction
  };
}

const getEmptyTileUrl = (max, name, format) => {
  const getTileUrl = getGetTileUrl('target', name, max, format);
  return (level, x, y) => {
    return getTileUrl(level, x, y);
  }
}

const to_mask_image = (init, image, grid_shape, hashstate, viewer, mask) => {
  const { displayWidth } = to_image_shape(image, grid_shape)
  const tileWidth = image.TileSize.slice(0,1).pop();
  const tileHeight = image.TileSize.slice(0,2).pop();
  return {
      loadTilesWithAjax: false,
      compositeOperation: 'source-over',
      tileSource: {
        image,
        is_mask: true,
        path: mask.Path,
        colorize: mask.Colorize,
        tileHeight: tileHeight,
        tileWidth: tileWidth,
        height: image.Height,
        width:  image.Width,
        maxLevel: image.MaxLevel,
        getTileUrl: getGetTileUrl(
          image.Path, mask.Path, image.MaxLevel, mask.Format
        )
      },
      success: () => {
        hashstate.newMasks(viewer);
        init.init();
      },
      x: 0,
      y: 0,
      opacity: 1.0,
      width: displayWidth,
    }
}

const to_tile_target = (init, image, grid_shape, hashstate, viewer, isLens) => {
  const { displayWidth } = to_image_shape(image, grid_shape)
  const tileWidth = image.TileSize.slice(0,1).pop();
  const tileHeight = image.TileSize.slice(0,2).pop();
  const kind = ['main', 'lens'][+isLens];
  const name = `render-layer-${kind}`;
  return {
    loadTilesWithAjax: false,
    compositeOperation: 'source-over',
    tileSource: toTileTarget(hashstate, viewer, isLens, {
      image,
      path: '',
      name: name,
      is_mask: false,
      colorize: true,
      tileHeight: tileHeight,
      tileWidth: tileWidth,
      height: image.Height,
      width:  image.Width,
      maxLevel: image.MaxLevel,
      getTileUrl: getEmptyTileUrl(image.MaxLevel, name, 'jpg')
    }),
    x: 0,
    y: 0,
    opacity: 1.0,
    width: displayWidth,
    success: ({ item }) => {
      hashstate.gl_state.setTargetImage(item, isLens)
      init.init();
    }
  }
}

const build_page_with_exhibit = function(exhibit, options) {
  // Initialize state
  const hashstate = new HashState(exhibit, options);
  const grid = hashstate.grid;
  const grid_shape = to_grid_shape(grid);

  // Limit the number of OSD tiles
  const max_lens_channels = 1;
  const maxImageCacheCount = Math.max(
    32, Math.round(nTex / max_lens_channels)
  )
  // Initialize openseadragon
  const viewer = OpenSeadragon({
    maxImageCacheCount,
    compositeOperation: 'source-over',
    id: options.id + '-openseadragon',
    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.3.1/images/',
    navigatorPosition: 'BOTTOM_RIGHT',
    zoomOutButton: options.id + '-zoom-out',
    zoomInButton: options.id + '-zoom-in',
    maxZoomPixelRatio: 10,
    visibilityRatio: .9,
    immediateRender: false,
    degrees: exhibit.Rotation || 0
  });
  const image = grid[0][0];
  hashstate.gl_state.setViewer(viewer);
  // Define all required layers
  const gl_targets = [
    false, true
  ];
  const n_total_layers = (
    hashstate.mask_layers.length + gl_targets.length
  );
  // Prepare to initialize
  const init = new Initializer(n_total_layers, hashstate, viewer);
  // Add all standard image layers
  gl_targets.forEach(isLens => {
    const target = to_tile_target(init, image, grid_shape, hashstate, viewer, isLens);
    viewer.addTiledImage(target);
  })
  hashstate.createLens(viewer);
  // Add all mask layers, if present
  hashstate.mask_layers.forEach(mask => {
    // Add a single mask layer
    const mask_image = to_mask_image(init, image, grid_shape, hashstate, viewer, mask)
    viewer.addTiledImage(mask_image)
  })

  // Constantly reset each arrow transform property
	function updateOverlays() {
			viewer.currentOverlays.forEach(overlay => {
          const isArrow = overlay.element.id.slice(0,13) == 'minerva-arrow';
					if (isArrow) {
						overlay.element.style.transform = '';
					}
			});
	}

	viewer.addHandler("update-viewport", function(){
			setTimeout(updateOverlays, 1);
	});

	viewer.addHandler("animation", updateOverlays);

  // Add size scalebar
  viewer.scalebar({
    location: 3,
    minWidth: '100px',
    type: 'Microscopy',
    stayInsideImage: false,
    pixelsPerMeter: 1000000*exhibit.PixelsPerMicron || 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    fontColor: 'rgb(255, 255, 255)',
    color: 'rgb(255, 255, 255)'
  });

  arrange_images(viewer, hashstate);

  return viewer;
};

export const build_page = function(options) {

  if (Array.isArray(options.markerData)) {
    marker_data = options.markerData;
  }
  if (Array.isArray(options.cellTypeData)) {
    cell_type_data = options.cellTypeData;
  }
  // define the marker and cell type links table
  const marker_maps = get_links_alias(marker_data);
  options.marker_links_map = marker_maps[0];
  options.marker_alias_map = marker_maps[1];
  const cell_type_maps = get_links_alias(cell_type_data);
  options.cell_type_links_map = cell_type_maps[0];
  options.cell_type_alias_map = cell_type_maps[1];

  // fill the main div with content
  const el = document.getElementById(options.id);
  el.innerHTML = exhibitHTML;
  const home_el = el.getElementsByClassName('minerva-home-button')[0];
  const osd_el = el.getElementsByClassName('minerva-openseadragon')[0];
  const zoom_out_el = el.getElementsByClassName('minerva-zoom-out')[0];
  const zoom_in_el = el.getElementsByClassName('minerva-zoom-in')[0];
  options.noHome = !options.homeUrl;
  if (!options.noHome) {
    home_el.href = options.homeUrl;
  }
  osd_el.id = options.id + '-openseadragon';
  zoom_out_el.id = options.id + '-zoom-out';
  zoom_in_el.id = options.id + '-zoom-in';

  $('.js-toggle-osd-side-nav').click(function() {
    $('#osd-side-nav').position().top == 0
      ? $('#osd-side-nav').css('top', '75vh')
      : $('#osd-side-nav').css('top', 0);
    $('#osd-side-nav').scrollTop(0);
  });

  options.el = el;
  const duplicateViewButton = el.getElementsByClassName('minerva-duplicate-view')[0];
  duplicateViewButton.onclick = makeTwinViewer;

  var exhibit = options.exhibit;
  if (typeof exhibit === 'string' || exhibit instanceof String) {
    return fetch(exhibit)
      .then(response => response.json())
      .then(data => build_page_with_exhibit(data, options));
  }
  else {
    return Promise.resolve(build_page_with_exhibit(exhibit, options));
  }

};
