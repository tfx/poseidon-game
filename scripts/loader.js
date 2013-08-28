var jewel = {
    screens : {}
};

window.addEventListener("load", function() {

Modernizr.addTest("standalone", function() {
    return (window.navigator.standalone != false);
});

// loading stage 1
Modernizr.load([
{ 
    load : [
        "scripts/sizzle.js",
        "scripts/dom.js",
        "scripts/game.js"
    ]
},{
    test : Modernizr.standalone,
    yep : "scripts/screen.splash.js",
    nope : "scripts/screen.install.js",
    complete : function() {
        jewel.game.setup();
        if (Modernizr.standalone) {
            jewel.game.showScreen("splash-screen");
        } else {
            jewel.game.showScreen("install-screen");
        }
    }
}
]);

// loading stage 2
if (Modernizr.standalone) {
    Modernizr.load([
    {
        load : ["scripts/screen.main-menu.js"]
    },{
        load : ["loader!scripts/screen.hiscore.js"]
    }
    ]);
}


}, false);
