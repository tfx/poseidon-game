
var name = '';
var socket = io.connect('http://localhost:8000');

         // at document read (runs only ones).
         $(document).ready(function(){

            var logs = $("#txtAreaDisplay");
            var input = $("#txtTextArea");
            var btnSend =  $("button:#btnEnterText");
            btnSend.click(function(){      
               // send message on inputbox to server
               socket.emit('chat', input.val() );
               
               logs.val(logs.val()+"\r\n" + name + ': ' + input.val());
               
               // then we empty the text on the input box.
               input.val('');
            });
            
            // ask for the name of the user, ask again if no name.
            while (name == '') {
               name = prompt("What's your name?","");
            }
            
            // send the name to the server, and the server's 
            // register wait will recieve this.
            socket.emit('register', name );
         });

         // listen for chat event and recieve data
         socket.on('chat', function (data) {

            // print data (jquery thing)
            $("#txtAreaDisplay").val($("#txtAreaDisplay").val()+"\r\n" + data.msgr + ': ' + data.msg);
             // we log this event for fun :D
             $("p#log").html('got message: ' + data.msg);

          });
         function sendMessageToServer(){      
               // send message on inputbox to server
               socket.emit('chat', $("#txtTextArea").val() );
               
               $("#txtAreaDisplay").val( $("#txtAreaDisplay").val()+"\r\n" + name + ': ' + $("#txtTextArea").val());
               
               // then we empty the text on the input box.
               $("#txtTextArea").val('');
            };