jewel.screens["splash-screen"] = (function() {
    var game = jewel.game,
    dom = jewel.dom,
    firstRun = true;
var main_menu = document.getElementById("main-menu");
var splash = document.getElementById("splash-screen");

    var continueButton = document.getElementById("btnContinue");
    continueButton.addEventListener("click",function(){ 
        main_menu.style.display = 'block';
        splash.style.display = 'none';
        game.showScreen("main-menu");    
    }, false);

    function setup() {
        // dom.bind("#splash-screen", "click", function() {
        //     game.showScreen("main-menu");
        // });
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
