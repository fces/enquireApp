/*
    Agents CRUD Logic
    
    @date: 11/8/2017
    @author: FC, ES 
*/

/* DOM Utils */

// Add id att to a DOM node
function setNodeId(node, id) {
    var att = document.createAttribute("id");
    att.value = id;
    node.setAttributeNode(att);
}

// Create new DOM node
function createNode(type, id, childNode) {
    var newElement = document.createElement(type);
    if (id) {
        setNodeId(newElement, id);
    }
    if (childNode) {
        newElement.appendChild(childNode);
    }
    return newElement;
}

// Create new text Node
function createTextNode(text) {
    return document.createTextNode(text);
}

// Create new clickable div with action
function createButtonNode(id,text, action) {
    var btnTxt = createTextNode(text);
    var btn = createNode('DIV', id, btnTxt);
    var onAtt = document.createAttribute("onclick");
    onAtt.value = action;
    btn.setAttributeNode(onAtt);
    return btn;
};

/* Views Manipulation */

const contentListId = 'list'
const updateOnClick = 'updateAction(this.id.substring(2))'

// Populates Main Content List
function populateContentList(listId) {
    var listNode = document.getElementById(listId);
    getData(function(data) {
        for (var i in data) {
            var agent = data[i];
            var liTxt = createTextNode( "Name: " + agent.name + " | Surname: " + agent.surname + " | ID: " + agent._id);
            var liTag = createNode('LI', agent._id, liTxt);
            liTag.appendChild(createButtonNode("D_"+agent._id,'D', 'deleteAction(this.id.substring(2))'));
            liTag.appendChild(createButtonNode("U_"+agent._id,'U', updateOnClick));
            liTag.appendChild(createButtonNode("R_"+agent._id,'R', 'readAction(this.id.substring(2))'));
            listNode.appendChild(liTag);
        }
    });
};

// Refresh Content List
function refreshContent() {
    var listNode = document.getElementById(contentListId);
    // Delete all child elements
    while (listNode.hasChildNodes()) {
        listNode.removeChild(listNode.lastChild);
    }
    populateContentList(contentListId);
}

/* API Utils */

// API req wrapper function
function apiRequest(method,url,headers,status,send,callback){
    console.log("apiRequest: met "+method+"  url "+url+" head "+headers+" stat "+status);
    var xReq = new XMLHttpRequest();
    xReq.onreadystatechange = function (e) {
        if (xReq.readyState == 4 && xReq.status == status) {
            callback(xReq.responseText);
        }
    }
    xReq.open(method, url, true);
    if (headers){
        for (i in headers){
            var h = headers[i];
            var keys = Object.keys(h);
            for (j in keys){
                var k = keys[j];
                var v = h[k];
                xReq.setRequestHeader(k,v);
            }
        }
    }

    if(send){
        xReq.send(send);
    } else {
        xReq.send();
    }
}

// Get Agent List
function getData(callback) {
    apiRequest('GET','/api/agents/list',null,200,null,function (d){
        callback(JSON.parse(d));
    });
}

// Update Agent
function updateData(id,form){
    console.log("Update data: '"+id+"'")
    var newName = form.name.value;
    var newSurname = form.surname.value;
    var send = JSON.stringify({name:newName,surname:newSurname});

    apiRequest('PUT', '/api/agents/update/'+id,[{"Content-type":"application/json"}],204,send,
               function (d){ 
        var updateFormNode = document.getElementById('update-form');
        updateFormNode.remove();
        // get clicked button
        var clickedButtonNode = document.getElementById("U_"+id);
        // activate clicked button
        var onclickAtt = document.createAttribute("onclick");
        onclickAtt.value = updateOnClick;
        clickedButtonNode.setAttributeNode(onclickAtt);
        console.log("Updated "+id);
        console.log('New name: '+newName+' New Surname: '+newSurname);
        refreshContent();
    });

}

/* Actions */

// Create Agent
function createAction(form) {
    console.log("Create data")
    var newName = form.name.value;
    var newSurname = form.surname.value;
    var send = JSON.stringify({name:newName,surname:newSurname});

    apiRequest('POST', '/api/agents/create/',[{"Content-type":"application/json"}],201,send, 
               function (d){ 
        console.log("New Agent created");
        refreshContent();
    }
              );
}

// Read Agent
function readAction(id) {
    console.log("Read Action id: '"+id+"'");

    apiRequest('GET', '/api/agents/read/'+id,null,200,null,
               function (d){ 
        var v = JSON.parse(d);
        alert('Name: '+v.name+' Surname: '+v.surname);
    });
}

// Update Agent
function updateAction(id) {
    console.log("Update Action id: '"+id+"'");
    // get clicked button
    var clickedButtonNode = document.getElementById("U_"+id);
    // deactivate clicked button
    clickedButtonNode.removeAttribute("onclick");
    // get id's li tag in list
    var liNode = document.getElementById(id);
    // populate id's li tag with form
    liNode.innerHTML+='<div id="update-form"><form>\
<label>New name: </label><input required type="text" name="name">\
<label>New surname: </label><input required type="text" name="surname">\
<input id="'+ id +'" onclick="updateData(this.id, this.form)" value="Update Agent" type="button"> \
</form></div>';
}

// Delete Agent
function deleteAction(id){
    console.log("Delete Action id: '"+id+"'");
    var res = confirm("You Are goign to delete agent with id:\n                  "+id+"\nThis operation cannot be undone, procede anyway?");
    if (res) {
        apiRequest('DELETE', '/api/agents/delete/'+id,null,204,null,
                   function (d){ 
            console.log("Deleted "+id);
            document.getElementById(id).remove();
            alert("Agent ("+id+") Deleted!");
            //refreshContent();
        });
    }

}
