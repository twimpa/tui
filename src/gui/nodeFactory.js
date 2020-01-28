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



