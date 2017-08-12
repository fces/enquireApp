/*
    Locations CRUD Logic

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
            var location = data[i];
            var liTxt = createTextNode( "Name: " + location.name + " | Lat: " + location.lat + " | Lon: " + location.lon +" | ID: " + location._id);
            var liTag = createNode('LI', location._id, liTxt);
            liTag.appendChild(createButtonNode("D_"+location._id,'D', 'deleteAction(this.id.substring(2))'));
            liTag.appendChild(createButtonNode("U_"+location._id,'U', updateOnClick));
            liTag.appendChild(createButtonNode("R_"+location._id,'R', 'readAction(this.id.substring(2))'));
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

// Get Location List
function getData(callback) {
    console.log("getData");
    apiRequest('GET','/api/locations/list',null,200,null,function (d){
        callback(JSON.parse(d));
    });
}

// Update Location
function updateData(id,form){
    console.log("Update data: '"+id+"'")
    var newName = form.name.value;
    var newLat = form.lat.value;
    var newLon = form.lon.value;
    var send = JSON.stringify({name:newName,lat:newLat,lon:newLon});

    apiRequest('PUT', '/api/locations/update/'+id,[{"Content-type":"application/json"}],204,send,
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
        console.log('New name: '+newName+' New Lat: '+newLat+' New Lon: '+newLon);
        refreshContent();
    });

}

/* Actions */

// Create Location
function createAction(form) {
    console.log("Create data")
    var newName = form.name.value;
    var newLat = form.lat.value;
    var newLon = form.lon.value;
    var send = JSON.stringify({name:newName,lat:newLat,lon:newLon});

    apiRequest('POST', '/api/locations/create/',[{"Content-type":"application/json"}],201,send, 
               function (d){ 
        console.log("New Location created");
        refreshContent();
    }
              );
}

// Read Location
function readAction(id) {
    console.log("Read Action id: '"+id+"'");

    apiRequest('GET', '/api/locations/read/'+id,null,200,null,
               function (d){ 
        var v = JSON.parse(d);
        alert('Name: '+v.name+' Lat: '+v.lat+' Lon: '+v.lon);
    });
}

// Update Location
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
<label>New lat: </label><input required type="text" name="lat">\
<label>New lon: </label><input required type="text" name="lon">\
<input id="'+ id +'" onclick="updateData(this.id, this.form)" value="Update Location" type="button"> \
</form></div>';
}

// Delete Location
function deleteAction(id){
    console.log("Delete Action id: '"+id+"'");
    var res = confirm("You Are goign to delete location with id:\n                  "+id+"\nThis operation cannot be undone, procede anyway?");
    if (res) {
        apiRequest('DELETE', '/api/locations/delete/'+id,null,204,null,
                   function (d){ 
            console.log("Deleted "+id);
            document.getElementById(id).remove();
            alert("Location ("+id+") Deleted!");
            //refreshContent();
        });
    }

}
