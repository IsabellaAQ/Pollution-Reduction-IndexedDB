var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        
            var dataBase = null;
                
            function startDB() {
            
                dataBase = indexedDB.open("PollutionReduction", 1);
                
                dataBase.onupgradeneeded = function (e) {

                    active = dataBase.result;
                    
                    object = active.createObjectStore("people", { keyPath : 'id', autoIncrement : true });
                    object.createIndex('by_name', 'nombre', { unique : false });
                    object.createIndex('by_surname', 'apellido', { unique : false });
                    object.createIndex('user', 'usuario', { unique : true });
                    object.createIndex('password', 'contrasena', {unique:false});

                    vehiculo = active.createObjectStore("vehiculos", { keyPath : 'id', autoIncrement : true });
                    vehiculo.createIndex('placa', 'placa', { unique : true });
                    vehiculo.createIndex('modelo', 'modelo', { unique : false });
                    vehiculo.createIndex('c_dispositivo', 'c_dispositivo', { unique : true });                    
                };
                
                dataBase.onsuccess = function (e) {
                    //alert('Base de datos cargada correctamente');
                    loadAll();
                };
        
                dataBase.onerror = function (e)  {
                    //alert('Error cargando la base de datos');
                };
            }
            function add() {
                var active = dataBase.result;
                var data = active.transaction(["people"], "readwrite");
                var object = data.objectStore("people");

                var request = object.put({
                    nombre: document.querySelector("#nombre").value,
                    apellido: document.querySelector("#apellido").value,                    
                    usuario: document.querySelector("#usuario").value,
                    clave: document.querySelector("#contrasena").value
                });

                request.onerror = function (e) {
                    alert("Inválido");
                };

                data.oncomplete = function (e) {
                    if(document.getElementById("nombre").value !==""){
                        if(document.getElementById("apellido").value !==""){
                            if(document.getElementById("usuario").value !==""){
                                if(document.getElementById("contrasena").value !==""){
                                    alert('Registro exitoso');
                                    location.href="registro_emisiones.html";
                                    //loadAll();
                                }
                            }
                        }   
                    }                    
                };
                
            };

                function login(){
        var bCorreo = document.getElementById("usuariol").value;
        var bContra = document.getElementById("contral").value;


        
       //Creamos la transacción
            var active = dataBase.result;
            var data = active.transaction(["people"], "readwrite");
            var object = data.objectStore("people");

            var index = object.index("usuario");

            var request = index.openCursor(bCorreo);

            request.onsuccess = function(e){
            var cursor= e.target.result;

            if (cursor) {
            
            var SisCorreo = cursor.value.usuario;
            var SisContra = cursor.value.clave;



            //cursor.continue();

           

            } 
            
            
            if (SisCorreo == bCorreo && bContra == SisContra){ 
                document.getElementById("nombre").value= cursor.value.nombre;
                alert("Ingreso exítoso");
                location.href="registro_emisiones.html";
            }
            
        


            if (SisCorreo !== bCorreo || bContra !== SisContra){
            document.getElementById("nombre").value= "";
            alert("Login INCORRECTO ");
            }    

            //document.getElementById("name").value= "";
            document.getElementById("usuariol").value="";
            
         
    }

                
};

            function addv(){
                var active = dataBase.result;
                var data = active.transaction(["vehiculos"], "readwrite");
                var vehiculo = data.objectStore("vehiculos");

                var request = vehiculo.put({
                    placa: document.querySelector("#placa").value,
                    modelo: document.querySelector("#modelo").value,                    
                    c_dispositivo: document.querySelector("#c_dispositivo").value,
                });

                request.onerror = function (e) {
                    alert("Inválido");
                };

                data.oncomplete = function (e) {
                    if(document.getElementById("placa").value !==""){
                        if(document.getElementById("modelo").value !==""){
                            if(document.getElementById("c_dispositivo").value !==""){
                                    alert('Registro de vehículo exitoso');
                                    location.href="registro_emisiones.html"; 
                                    //loadAll();                           
                            }
                        }   
                    }                    
                };
            };
            
            function loadAll(){
                var active = dataBase.result;
                var data = active.transaction(["people"], "readonly");
                var object = data.objectStore("people");;
                var elements = [];
                object.openCursor().onsuccess = function (e){
                    var result = e.target.result;
                    if (result === null) {
                        return;
                    }
                    elements.push(result.value);
                    result.continue();
                };
                data.oncomplete = function () {
                    var outerHTML = '';
                    for (var key in elements) {
                        outerHTML += '\n\
                                        <tr>\n\
                                            <td>' + elements[key].nombre + '</td>\n\
                                            <td>' + elements[key].apellido + '</td>\n\
                                        </tr>';
                    }
                    elements = [];
                    document.querySelector("#elementsList").innerHTML = outerHTML;
                };
            }
            