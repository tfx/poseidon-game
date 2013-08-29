jewel.screens["main-menu"] = (function() {
    var dom = jewel.dom,
        game = jewel.game,
        firstRun = true;
    var splash = document.getElementById("splash-screen");
    var main_menu = document.getElementById("main-menu");
    var single = document.getElementById("game-screen");
    single.addEventListener("click",function(){ 
        window.location = "../public/index.html";
    }, false);
    var backButton = document.getElementById("btnBack");
    backButton.addEventListener("click",function(){ 
        splash.style.display = "block"; 
        main_menu.style.display = 'none';  
    }, false);

    function setup() {
        dom.bind("#main-menu ul.menu", "click", function(e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("name");
                game.showScreen(action);
            }
        });
    }

    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }

    return {
        run : run
    };
})();
