/*
 *  TWIP: Tiny Web Image Processing Visual Tool
 *  Copyright (C) 2019  Jean-Christophe Taveau.
 *
 *  This file is part of TWIP
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TWIP.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';


const xmlns = "http://www.w3.org/2000/svg";

/**
 * Return Numerical ID used by graph from node ID (in DOM)
 *
 * @author Jean-Christophe Taveau
 */
const getID = (nodeid) => nodeid.match(/\d+/)[0];


// Zoom Event with mouse wheel scroll
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    TWIP.zoom += 0.05*(-delta);
    console.info(delta,TWIP.zoom);
    document.querySelector('#board').style.transform = `
      translate(50%,50%) 
      scale(${TWIP.zoom}) 
      translate(${TWIP.translate.x}px,${TWIP.translate.y}px) 
      translate(-50%,-50%) 
    `;
    TWIP.graph.updateAllEdges(document.querySelectorAll('section'));
    event.preventDefault();
});

// Pan Event with mouse wheel click
const translStart = (event) => {
  // Do nothing
  if (DRAG.button !== 2) {
    return false;
  }
  console.log('start',event.which);
  DRAG.button = event.which;
  return document.querySelector('#board');
}

const translOver = (event) => {
    console.log('middle button',event.which);

  if (DRAG.button !== 2) {
    return true;
  }

  console.log('middle button',DRAG.newDX,DRAG.newDY);
  document.querySelector('#board').style.transform = `
    translate(50%,50%) 
    scale(${TWIP.zoom}) 
    translate(${TWIP.translate.x + DRAG.newDX}px,${TWIP.translate.y + DRAG.newDY}px) 
    translate(-50%,-50%)`;
  TWIP.graph.updateAllEdges(document.querySelectorAll('section'));

}

const translEnd = (event) => {
  // Do nothing
  if (DRAG.button !== 2) {
    return true;
  }
  TWIP.translate.x += DRAG.newDX;
  TWIP.translate.y += DRAG.newDY;
  event.preventDefault();
}

const TWIP = {
  version: "0.1",
  author: "Jean-Christophe Taveau",
  graph: new Graph(),
  zoom: 1.0,
  translate: {x:0,y:0},
  tx: 0,
  ty: 0,
  init: function() {
    console.log('INIT ',document.querySelector('#board'));
    document.querySelector('#board').style.transform = `translate(50%,50%) scale(1) translate(-50%,-50%)`;
    draggable(document.querySelector('#board'),translStart,translOver,translEnd);
  }
}



/*
window.addEventListener("mousedown", event => {
    if (event.which === 2) {
      console.log('middle button');
      TWIP.translate.x +=1;
      TWIP.translate.y +=0.5;

      let mainTransform = document.querySelector('main').style.transform;
      let regex = /translate\([^\)]*\)/gi;
      if (regex.test(mainTransform) ) {
        document.querySelector('main').style.transform = mainTransform.replace(regex, `translate(${TWIP.translate.x}px,${TWIP.translate.y}px)`);
      }
      else {
        document.querySelector('main').style.transform += ` translate(${TWIP.translate.x}px,${TWIP.translate.y}px)`;
      }
      event.preventDefault();
    }

});
*/

