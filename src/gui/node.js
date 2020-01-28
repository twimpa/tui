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


class Node {

  constructor(id,template,metadata) {
    this.id = id;
    this.template = template;
    this.element = document.createElement('section');

    this.hasLayers = template.properties.some( (p) => p.layer !== undefined);
    this.hasOutputs = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'output') || p.output !== undefined);
    this.hasInputs  = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'input')  || p.input !== undefined);

    this.createNode(template,id,metadata);
  }

  /**
   *
   * @author Jean-Christophe Taveau
   */
  createNode(node,id,metadata) {

    // Main
    console.log('CREATE ' + node.description);
    let nodeH = this.element;
    nodeH.id = 'node_'+id;
    nodeH.style.left = (metadata.x) ? `${metadata.x}px`: `${Math.floor(Math.random() * 1000)}px`;
    nodeH.style.top  = (metadata.y) ? `${metadata.y}px`: `${Math.floor(Math.random() * 600)}px`;

    // Head
    let head = this.createHeader(node,id,metadata);

    // Shrink
    let shrink = this.createShrinkArea(node,id,metadata);

    // Body
    let body = this.createBody(node,id,metadata);
    
    // Footer
    let foot = this.createFooter(node,id,metadata);

    // Append all the parts
    nodeH.appendChild(head);
    nodeH.appendChild(shrink);
    nodeH.appendChild(body);
    nodeH.appendChild(foot);

  }

  /*
   * Create Header
   *
   * @author Jean-Christophe Taveau
   */
  createHeader(node,id,metadata) {
    let nodeH = this.element;

    // Header
    let head = document.createElement('div'); head.className = 'header'; head.classList.add(node.class.replace('.','_').toLowerCase());
    let preview = node.preview ? '<a href="#"><span class="preview"><i class="far fa-eye"></i></span></a>' : '';
    let desc =  node.description;
    head.innerHTML = `
      <p title="${node.help ? node.help : "No Help"}" data-nodeid="${id}">
        <a href="#" id="expand_${id}" onclick="shrinkExpand(event)">
          <span class="expandB">&#9662;</span>
          <span class="shrinkB">&#9656;</span>
        </a>
        &nbsp;&nbsp;#${node.id} - ${desc} &nbsp;${preview}
      </p>`;


    return head;
  }

  /*
   * Create Shrinkable View of node
   *
   * @author Jean-Christophe Taveau
   */
  createShrinkArea(node,id,metadata) {

    let shrink = document.createElement('div');
    shrink.className = 'shrinkdiv'; shrink.classList.add(node.class.replace('.','_').toLowerCase());
    shrink.innerHTML = (this.hasInputs) ? '<span class="in_socket"><i class="fas fa-chevron-circle-right"></i></span>': '';
    shrink.innerHTML += '<p>&nbsp;</p>';
    shrink.innerHTML += (this.hasOutputs) ? '<span class="out_socket"><i class="fas fa-chevron-circle-right"></i></span>' : '';
    return shrink;
  }


  /*
   * Create Body
   *
   * @author Jean-Christophe Taveau
   */
  createBody(node,id,metadata) {

    // Body
    let body = document.createElement('div');
    body.id = 'body_'+id;
    body.className = 'body';
    // Main content

    NodeFactory.createContent( node.properties,body,this.id );

    return body;
  }


  /*
   * Create the footer
   *
   * @author Jean-Christophe Taveau
   */
  createFooter(node,id,metadata) {
  
    const resizeStart = (event) => {
      event.preventDefault();
      console.log('EVENT',event.target.dataset.nodeid);
      let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
      DRAG.width = dragged.getBoundingClientRect().width;
      DRAG.node = dragged;
      return dragged;
    }

    const resizeMove = (event) => {
      event.preventDefault();
      let dragged = DRAG.node;

      // Apply the inverse of transform matrix of `board`
      DRAG.node.style.width = DRAG.width + ((DRAG.BBox.x - TWIP.tx)/TWIP.zoom + DRAG.newDX/TWIP.zoom)  + 'px';
      DRAG.node.style.height  = ((DRAG.BBox.y - TWIP.ty)/TWIP.zoom + DRAG.newDY/TWIP.zoom)  + 'px';
    };

    const resizeEnd = (event) => {
      // Do nothing?
      event.preventDefault();
    };


    let foot = document.createElement('div');
    foot.className = 'footer';
    foot.innerHTML = `<span style="align:right;margin:2px">${node.class}</span>`;
    let link = document.createElement('a');
    foot.appendChild(link);
    link.dataset.nodeid = id;
    link.innerHTML = `
      <svg preserveAspectRatio="xMinYMin" viewBox="0 0 20 20">
        <circle cx="18" cy="6" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="6"  cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="18" r="2" stroke="none" fill="#777"/>
      </svg>`; 

    draggable( link,resizeStart,resizeMove, resizeEnd);
    return foot;
  }



} // End of class Node


