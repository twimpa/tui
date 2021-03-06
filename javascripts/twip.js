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


class NodeFactory {

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createOutputs(rows,nodeid) {
    let element;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createBody(rows,nodeid) {
    let element = document.createElement('div');
    element.id = `body_${id}`;
    element.className = `body`;
    rows.forEach( row => element.appendChild(NodeFactory.createRow(row),nodeid) );
    return element;
  }

  static createContent(rows,parent,id) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    rows.forEach( (row,index) => {
      if (row.layer !== undefined) {
        let container = document.createElement('div');
        container.className = 'layer';
        container.id = `layer_${index}`;
        NodeFactory.createRows(row.properties,container,nodeid);
        parent.appendChild(container);
        container.style.display = (index === 0) ? 'block': 'none';
      }
      else {
        let container = NodeFactory.createRow(row,nodeid);
        if (row.output !== undefined) {
          container.id = `o_${outputs++}`;
          container.classList.add('output');
        }
        else if (row.input !== undefined) {
          container.id = `i_${inputs++}`;
          container.classList.add('input');
        }
        parent.appendChild(container);
      }
    });
  }

  static createRows(rows,parent,id) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    rows.forEach( row => {
      let container = NodeFactory.createRow(row,nodeid);
      if (row.output !== undefined) {
        container.id = `o_${outputs++}`;
        // container.classList.add('output');
      }
      else if (row.input !== undefined) {
        container.id = `i_${inputs++}`;
        // container.classList.add('input');
      }
      parent.appendChild(container);
    });
  }


  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createRow(row,node_id) {
    // Extract widget type
    let cells = Object.keys(row).filter( prop => ['name','source','zip'].indexOf(prop) === -1);
    let numcolumns = cells.filter( type => ['input','output','source','name','zip'].indexOf(type) === -1).length;
    let container = document.createElement('div');
    container.className = `row-${numcolumns}`;

    cells.forEach( type => {
      console.log(type);
      let widget = NodeFactory.createWidget(type,row,node_id);
      container.appendChild(widget);
    });

    console.log(container);
    return container;
  }

  static createWidget(type,row,id) {
    let element;
    switch (type) {
      case 'button': element = NodeFactory.button(row,id); break;
      case 'canvas': element = NodeFactory.canvas(row,id); break;
      case 'checkbox': element = NodeFactory.checkbox(row,id); break;
      case 'file': element = NodeFactory.file(row,id); break;
      case 'flowcontrols': element = NodeFactory.flowcontrols(row,id); break;
      case 'input': element = NodeFactory.input_socket(row,id); break;
      case 'label': element = NodeFactory.label(row,id); break;
      case 'numerical': element = NodeFactory.numerical(row,id); break;
      case 'readonly': element = NodeFactory.readonly(row,id); break;
      case 'selectlayer': element = NodeFactory.selectlayer(row,id); break;
      case 'select': element = NodeFactory.select(row,id); break;
      case 'output': element = NodeFactory.output_socket(row,id); break;
      case 'text': element = NodeFactory.text(row,id); break;
      default: 
        alert(`Unknown widget ${type}`);
    }
    return element;
  }
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static button(row,id) {
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let e = document.createElement('button');
    e.innerHTML = row.button;
    if (row.output === undefined && row.input === undefined) {
      e.innerHTML += ':&nbsp;';
    }
    container.appendChild(e);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static canvas(row,id) {
    // <div class="graphics"><canvas></canvas></div>
    let container = document.createElement('div');
    container.className = 'graphics';
    container.appendChild(document.createElement('canvas'));
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static checkbox(row,id) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "check";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('value',row.checkbox);
    input.checked = row.checkbox;
    container.appendChild(input);

    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static file(row,id) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "check";
    input.setAttribute("type", "file");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('value',row.checkbox);
    input.checked = row.checkbox;
    container.appendChild(input);

    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static flowcontrols(row,id) {
    let buttons = row.flowcontrols.toString(2);
    console.log(buttons);
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let controls = document.createElement('div');
    controls.className = 'flowcontrols';
    container.appendChild(controls);
    [...buttons].forEach ( (b,index) => {
      if (b === "1") {
        let button = document.createElement('button');
        switch (index) {
          case 0: 
            // Fast Backward (Go to start)
            button.className = 'fastbckwrd';
            button.innerHTML = '<i class="fas fa-fast-backward fa-sm"></i>';break;
          case 1:
            // Step backward
            button.className = 'stepbckwrd';
            button.innerHTML = '<i class="fas fa-step-backward fa-sm"></i>';break;
          case 2:
            // Play/Pause
            button.className = 'play';
            button.innerHTML = '<i class="fas fa-play fa-sm"></i>'; break;
            //button.innerHTML = '<i class="fas fa-pause fa-sm"></i>'; break;
          case 3:
            // Step Forward
            button.className = 'stepfrwrd';
            button.innerHTML = '<i class="fas fa-step-forward fa-sm"></i>';break;
          case 4:
            // Fast Forward (Go to end)
            button.className = 'fastfrwrd';
            button.innerHTML = '<i class="fas fa-fast-forward fa-sm"></i>';break;
          default:
            alert('Unknown Flow Controls');
        }
        controls.appendChild(button);
      }
    });

    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static numerical(row,id) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',8);
    input.setAttribute('size',10);
    input.setAttribute('value',row.numerical);
    input.addEventListener('input',(event)=> {
      let value = event.srcElement.value;
      event.srcElement.value = /^\d*\.?\d*$/.test(event.srcElement.value) ? value : value.slice(0,-1);
      return false;
    });
    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static readonly(row,id) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "readonly";
    input.readOnly = true;
    input.setAttribute("type", "text");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',8);
    input.setAttribute('size',10);
    input.setAttribute('value',row.readonly);

    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static select(row,id) {
    let container = document.createElement('div');
    container.className = "flex-cell select-container";
    let select = document.createElement('select');
    let options = row.select.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static selectlayer(row,id) {
    let container = document.createElement('div');
    container.className = "flex-cell select-container";
    let select = document.createElement('select');
    select.id = `selectlayer_${id}`;
    let options = row.selectlayer.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    select.addEventListener("change",displayLayer);
    
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static text(row,id) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.var || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',8);
    input.setAttribute('size',10);
    input.setAttribute('value',row.text);

    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }

  /*
   * 
   * @author Jean-Christophe Taveau
   */
  static label(row,id) {
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let e = document.createElement('label');
    e.innerHTML = row.label;
    if (row.output === undefined && row.input === undefined) {
      e.innerHTML += ':&nbsp;';
    }
    container.appendChild(e);
    return container;
  }

  /*
   * Create an input socket
   *
   * @author Jean-Christophe Taveau
   */
  static input_socket(row,id) {
    let container = document.createElement('div');
    container.className = 'input';
    let button = document.createElement('button');
    button.id = `insock_${id}[0]`;
    button.innerHTML = '<i class="fas fa-chevron-circle-right"></i>';
    draggable(button,edgeStart,edgeDrag,edgeEnd);
    container.appendChild(button);
    return container;
  }

  /*
   * 
   * @author Jean-Christophe Taveau
   */
  static output_socket(row,id) {
    let container = document.createElement('div');
    container.className = 'output';
    // container.innerHTML = '<button><i class="fas fa-chevron-circle-right"></i></button>';
    let button = document.createElement('button');
    button.id = `outsock_${id}[0]`;
    button.innerHTML = '<i class="fas fa-chevron-circle-right"></i>';
    draggable(button,edgeStart,edgeDrag,edgeEnd);
    container.appendChild(button);

    return container;
  }

} // End of class NodeFactory



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

class Edge {

  constructor(edge_id,source_id,target_id,input_connector = 0, output_connector = 0) {
    this.eid = edge_id;
    this.source = source_id;
    this.out = output_connector;
    this.target = target_id;
    this.in = input_connector;
    this.line = this._createEdge(edge_id,source_id,target_id,input_connector, output_connector);
  }

  // Private
  _createEdge(idE,idS,idT,input,output) {
    // Source
    let nodeS = document.querySelector(`#node_${idS} #o_${output} button`);
    let shrinkNodeS = document.querySelector(`#node_${idS} .out_socket`);
    let tmp = [idE];
    if (nodeS.dataset.edge !== undefined) {
      console.log(nodeS.dataset.edge);
      tmp = JSON.parse(nodeS.dataset.edge);
      tmp.push( idE);
    }
    nodeS.dataset.edge = JSON.stringify(tmp);
    if (shrinkNodeS.dataset.edge !== undefined) {
      let array = JSON.parse(shrinkNodeS.dataset.edge);
      array = [...array,...tmp].filter((v,i,indexes) => indexes.indexOf(v) === i);
      console.log(array);
      shrinkNodeS.dataset.edge = JSON.stringify(array);
    }
    else {
      shrinkNodeS.dataset.edge = nodeS.dataset.edge;
    }
    
    // Target
    let nodeT = document.querySelector(`#node_${idT} #i_${input} button`);
    let shrinkNodeT = document.querySelector(`#node_${idT} .in_socket`);
    nodeT.dataset.edge = idE;
    if (shrinkNodeT.dataset.edge !== undefined) {
      let array = JSON.parse(shrinkNodeT.dataset.edge);
      array.push(idE);
      shrinkNodeT.dataset.edge = JSON.stringify(array);
      console.log('shrinkT ' + shrinkNodeT.dataset.edge + ' ' +  idE);
    }
    else {
      shrinkNodeT.dataset.edge = `[${idE}]`;
    }

    console.log(nodeS.id + '--> ' + nodeT.id);
    let start = this.getCoords(nodeS);
    let end = this.getCoords(nodeT);
    let line = document.createElementNS(xmlns,'line');
    line.dataset.source = `node_${idS}`;
    line.dataset.target = `node_${idT}`;
    line.setAttribute('id',`e_${idE}`);
    line.setAttribute('stroke-width',2.0);
    line.setAttribute('x1',start.x);
    line.setAttribute('y1',start.y);
    line.setAttribute('x2',end.x);
    line.setAttribute('y2',end.y);
    line.setAttribute("stroke", "#dfdfdf")
    return line;
  }


  /**
   *
   */
  getCoords(node) {
    let rect = node.getBoundingClientRect();
    // console.log(rect);
    return {
      x: rect.left + rect.width / 2.0 + window.scrollX,
      y: rect.top  + rect.height / 2.0 + window.scrollY
    }
  }

} // End of class Edge

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

class Graph {

  /**
   * @constructor
   * @author Jean-Christophe Taveau
   */
  constructor() {
    this.templates;
    this.nodes = [];
    this.edges = [];
    this.context; // svg or canvas/webgl?
    this.root; // HTML Parent node for all the nodes
  }

  build(json) {
    this.createNodes(json.nodes);
    this.createEdges(json.edges);
  }

  lastID() {
    return (this.nodes.length > 0) ? this.nodes[this.nodes.length - 1].id : 0;
  }

  appendNode(templateID,nodeID = -1,metadata={}) {
    let newid = (nodeID !== -1) ? nodeID : this.lastID() + 1; // TODO HACK
    let node =  new Node(newid,this.templates.find( n => n.id === templateID),metadata);
    this.nodes.push(node);
    this.root.appendChild(node.element);
    return node;
  }

  /**
   * Append node in the current Graph by its name
   *
   * @author Jean-Christophe Taveau
   */
  appendNodeByName(templateName,nodeID = -1,metadata={}) {

    let newid = (nodeID !== -1) ? nodeID : this.lastID() + 1; // TODO HACK
    let node =  new Node(newid,this.templates.find( n => n.name === templateName),metadata);
    this.nodes.push(node);
    this.root.appendChild(node.element);
    return node;
  }


  appendEdge(start_id,end_id) {
    let ctx = this.context;
    let eid = this.edges[this.edges.length - 1].eid++;
    let e = new Edge(eid,start_id,end_id,0,0);
    this.edges.push(e);
    ctx.append(e.line);
  }

  /**
   * Create Nodes of the given graph from templates
   *
   * @author Jean-Christophe Taveau
   */
  createNodes(nodes) {
    let root = this.root;
    // Create Graph
    nodes.forEach( (node) => {
      // Attach node to <root>
      console.log(node.template,node.id,node.metadata);
      console.log(this.templates.find( n => n.id === node.template));
      let n = new Node(node.id,this.templates.find( n => n.id === node.template),node.metadata);
      this.nodes.push(n);
      root.appendChild(n.element);
    });
  }

  /**
   * Create Edges of the given graph
   *
   * @author Jean-Christophe Taveau
   */
  createEdges(edges) {
    let ctx = this.context;
    edges.forEach( (edge) => {
      let e = new Edge(edge.eid,edge.source,edge.target,edge.in,edge.out);
      this.edges.push(e);
      ctx.append(e.line);
    });
  }

  getNode(id) {
  }
  
  getEdge(id) {
  }

  setGraphicsContext(context) {
    this.context = context;
  }

  setRootNode(parentNode) {
    this.root = parentNode;
  }

  setTemplates(nodeTemplates) {
    this.templates = nodeTemplates;
  }

  show() {
  }

  /**
   * Update edges of All the nodes defined in an array
   *
   * @param {array} nodes - Array of nodes whose edges must be updated
   *
   * @author Jean-Christophe Taveau
   */
  updateAllEdges(nodes) {
    console.log(nodes);
    nodes.forEach( n => {
      this.updateEdges(n, n.classList.contains('shrink') );
    });
  }

  /**
   * Update edges of a node
   *
   * @param {node} node - Node whose edges must be updated
   * @param {boolean} shrinkMode - State of the node appearance (shrinked or expanded)
   *
   * @author Jean-Christophe Taveau
   */
  updateEdges(node,shrinkMode = false) {
    console.log('UPDATE ' + shrinkMode);
    // Get Edge ID
    // let src_eid = document.querySelector(`#${node.id} .input button`);
    let sources = (shrinkMode) ? document.querySelectorAll(`#${node.id} .out_socket`) : document.querySelectorAll(`#${node.id} .output button`);
    if (sources !== null) {
      sources.forEach( s => {
        if (s.dataset.edge !== undefined) {
          JSON.parse(s.dataset.edge).forEach( (e) => {
            let line = document.getElementById( `e_${e}`);
            let start = this.getCoords(s);
            line.setAttribute('x1',start.x);
            line.setAttribute('y1',start.y);
          });
        }
      });
    }
    let targets = (shrinkMode) ? document.querySelectorAll(`#${node.id} .in_socket`) : document.querySelectorAll(`#${node.id} .input button`);
    if (targets !== null) {
      if (shrinkMode) {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            JSON.parse(t.dataset.edge).forEach( (e) => {
              let line = document.getElementById(`e_${e}`);
              let end = this.getCoords(t);
              line.setAttribute('x2',end.x);
              line.setAttribute('y2',end.y);
            });
          }
        });
      }
      else {
        targets.forEach( t => {
          if (t.dataset.edge !== undefined) {
            let line = document.getElementById(`e_${t.dataset.edge}`);
            let end = this.getCoords(t);
            line.setAttribute('x2',end.x);
            line.setAttribute('y2',end.y);
          }
        });
      }

    }
  }

  /**
   * Get geometry (x,y,width,height) and Compute absolute position
   */
  getCoords(element) {
    let rect = element.getBoundingClientRect();
    // console.log(rect);
    let cx = document.documentElement.clientWidth/2.0;
    let cy = document.documentElement.clientHeight/2.0;
    return {
      x: (rect.left + rect.width / 2.0 )  + window.scrollX,
      y: (rect.top  + rect.height / 2.0 ) + window.scrollY
    }
  }
} // End of class Graph


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

  /**
   * Events
   */
  const shrinkExpand = (evt) => {
    console.log('SHRINK/EXPAND');

    // Hide body, footer
    let id = evt.target.parentNode.id.match(/\d+/)[0];
    let node = document.getElementById(`node_${id}`);
    console.log(evt.target.parentNode.id,id);
    console.log(node);
    node.classList.toggle('shrink');

    // Shrink mode is true
    TWIP.graph.updateEdges(node,node.classList.contains('shrink'));
    console.log(node);
    evt.preventDefault();

  }

  const displayLayer = (evt) => {
    console.log(evt.target.value,evt.target.id);
    let id = evt.target.id.match(/\d+/)[0];
    console.log(id);
    // Pass #1
    let layers = document.querySelectorAll(`#body_${id} .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "block" : "none");
    // Pass #2
    layers = document.querySelectorAll(`#body_${id} .outputs .layer`);
    layers.forEach( (layer) => layer.style.display = (layer.id === `layer_${evt.target.value}`) ?  "block" : "none");
    console.log(layers);
  }

  /*
   * Functions used for click and drag of `edge`
   *
   * @author Jean-Christophe Taveau
   */
  const edgeStart = (event) => {
    console.log('EDGE start',event.target);
    DRAG.edge = getID(event.target.id);
    event.preventDefault();
    // Get canvas
    let ctx = document.querySelector('main svg');
    let line = document.createElementNS(xmlns,'line');
    line.dataset.source = event.target.id;
    line.dataset.target = event.target.id;
    line.setAttribute('id',`rubberband`);
    line.setAttribute('stroke-width',2.0);
    line.setAttribute('x1',event.x);
    line.setAttribute('y1',event.y);
    line.setAttribute('x2',event.x);
    line.setAttribute('y2',event.y);
    line.setAttribute("stroke", "#dfdfdf");
    ctx.append(line);
    return event.target;
  }

  const edgeDrag = (event) => {
    console.log('EDGE drag');
    let line = document.getElementById('rubberband');
    line.setAttribute('x2',event.x);
    line.setAttribute('y2',event.y);
    event.preventDefault();
  }

  const edgeEnd = (event) => {
    // Check if target is a complementary node (output/input) to source (input/output) node
    console.log(event.target);
    // Add an edge to the graph
    console.log(DRAG.edge,getID(event.target.id) );
    TWIP.graph.appendEdge(DRAG.edge,getID(event.target.id) );
    // Otherwise delete line
    document.getElementById('rubberband').remove();
    console.log('EDGE end',event.target);
    event.preventDefault();
  }

  /*
   * Functions used for click and drag of `node`
   *
   * @author Jean-Christophe Taveau
   */
  const dragStartNode = (event) => {
    event.preventDefault();
    let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
    DRAG.node = dragged;
    dragged.style.zIndex = 1000;
    let isShrinked = dragged.classList.contains('shrink');
    console.log(event.target.dataset.nodeid,dragged);
    // Update Edges
    TWIP.graph.updateEdges(dragged,isShrinked);
    return dragged;
  }

  const dragOverNode = (event) => {
    event.preventDefault();
    let dragged = DRAG.node;
    // Update Node(s)
    /************
    console.info('-----------\n   DRAG\n-----------');
    console.info('TRANSF. ',getMatrix(document.getElementById('board') ) );
    console.info(dragged.getBoundingClientRect().x,dragged.getBoundingClientRect().y);

    console.info(DRAG);
    console.info(TWIP);
    *************/


    // Apply the inverse of transform matrix of `board`
    DRAG.node.style.left = ((DRAG.BBox.x - TWIP.tx)/TWIP.zoom + DRAG.newDX/TWIP.zoom)  + 'px';
    DRAG.node.style.top  = ((DRAG.BBox.y - TWIP.ty)/TWIP.zoom + DRAG.newDY/TWIP.zoom)  + 'px';

    // Update Edges
    let isShrinked = dragged.classList.contains('shrink');
    TWIP.graph.updateEdges(dragged,isShrinked);
  }

  const dragEndNode = (event) => {
    // Update Edges
    let dragged = DRAG.node;
    dragged.style.zIndex = 1;
    TWIP.graph.updateEdges(dragged,dragged.classList.contains('shrink'));
  }

  const DRAG = {
    BBox:null,
    orgX: 0,
    orgY: 0,
    dx: 0,
    dy: 0,
    newDX: 0,
    newDY: 0
  }
  
  /**
   * Get Transformed coordinates
   */
  const getMatrix = (element) => {
    const parseMatrix = (transform) => transform.split(/\(|,|\)/).slice(1,-1).map( v => parseFloat(v) );

    let transform = window.getComputedStyle(element,null).transform;
    console.log(transform);
    return (transform === 'none') ?  parseMatrix('matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)') : parseMatrix(transform);
  }

  const getBoardTranslations = () => {
    let matrix = getMatrix(document.getElementById('board') );
    return [matrix[4],matrix[5]];
  }

  const getClickedCoords = (event) => [event.pageX,event.pageY];

  const getViewportCenter = () => {
    let cx = document.documentElement.clientWidth/2.0;
    let cy = document.documentElement.clientHeight/2.0;
    return [cx,cy];
  }


  const getBoundingBox = (element) => element.getBoundingClientRect(); 


  /**
   * Generic version of draggable
   */
  const draggable = (element,funcStart,funcOver,funcEnd) => {

    const dragstart = (event) => {

      // centers the tile at (pageX, pageY) coordinates
      const moveAt = (pageX, pageY) => {
        // console.log(orgX,orgY,pageX,pageY,dx,dy,' = ',pageX - orgX + dx,pageY - orgY + dy);
        DRAG.newDX = (pageX  - DRAG.orgX); ///TWIP.zoom; // WRONG
        DRAG.newDY = (pageY  - DRAG.orgY); ///TWIP.zoom;
      }

      const drag_over = (event) => {
        moveAt(event.pageX, event.pageY);
        // Run function
        funcOver(event);

        event.preventDefault();
        return false;
      }
      
      const drag_end = (event) => {
        window.removeEventListener('mousemove', drag_over,false);
        window.removeEventListener('mouseup', drag_end,false);
        // Update Edges
        funcEnd(event);
      }
      

      // M A I N of `dragstart`
      console.log(event);
      // Init
      DRAG.button = event.which;
      [TWIP.tx,TWIP.ty] = getBoardTranslations();

      // Step #1
      let dragged = funcStart(event);

      if (dragged === false) {
        return;
      }

      [DRAG.orgX,DRAG.orgY] = getClickedCoords(event); 
      [DRAG.cx,DRAG.cy] = getViewportCenter();
      DRAG.BBox = getBoundingBox(dragged);

      // Move the tile on mousemove
      window.addEventListener('mousemove', drag_over);

      // Drop the tile, remove unneeded handlers
      window.addEventListener('mouseup', drag_end);
      event.preventDefault();
    };

    // M A I N
    if (element.classList) {
      element.classList.add('movable');
    }
    else {
      element.className = 'movable';
    }

    element.addEventListener('mousedown', dragstart,false); 
    element.addEventListener('dragstart', (e) => {e.preventDefault();return false},false); 
    element.addEventListener('dragover', (e) => {return false},false); 
    element.addEventListener('drop', (e) => false,false); 
  }


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

