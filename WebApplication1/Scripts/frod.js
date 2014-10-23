frodo = {
    me: shire(), //gets a random string to act as a unique id *DO NOT CHANGE!*
    session: 0, //this is for a server handling multiple lobbies
    action: $.connection.chatHub, //gets the server-side connection object
    pile: [], //stores all the data being exchanged
    ready: false,
    bigPing: 0,

     //switches

    dev: true,
    devAll: true,


    init: function () {
        $.connection.hub.start().done(function () {
            frodo.ready = true;
            setInterval(frodo.ping(), 6000);
            setInterval(frodo.checkConnections(), 8000);
        });

        frodo.action.client.broadcastMessage = function (object) {
            frodo.pile[object.id] = object;
        };

        if (frodo.dev) {
            frodo.LayOutPile();
        }
        window.onbeforeunload = function() {
            frodo.appendGive({ quit: true, quitter: frodo.me });
            return false;
        }

    },

    give: function (dataObject) { //completly replace this hobbit's data on the pile, always get's frodo id
        dataObject.id = frodo.me;
        dataObject.session = frodo.session;
        frodo.action.server.send(dataObject);
    },
    appendGive: function(dataObject) { //append new fields onto the pile or give new values to existing ones
        if (dataObject.quit) {
            delete frodo.pile[dataObject.quitter];
            frodo.l("someone left!");
            return;
        }
        var NewKeys = [];
        for (var k in dataObject) {
            NewKeys[NewKeys.length] = k;
        }
        for (var i = 0; i < NewKeys.length; i++) {
            frodo.pile[frodo.me][NewKeys[i]] = dataObject[NewKeys[i]];
        }
    },
    recive: function() {
        return frodo.pile;
    },
    ping: function() {
        var d = new Date();
        frodo.l("in pinging...");
        if (frodo.pile[frodo.me]) {
            frodo.appendGive({ ping: d.getTime() });
            frodo.l("pinging...");
        }
    },
    checkConnections: function () {
        frodo.l("checking connections...");
        var bigTime = 0;
        for (var key in frodo.pile) {
            if (frodo.pile[key].ping) {
                if (frodo.pile[key].ping > bigTime) {
                    bigTime = frodo.pile[key].ping;
                }
            }
            
        }
        for (key in frodo.pile) {
            if (frodo.pile[key].ping) {
                if (frodo.pile[key].ping + 7000 < bigTime) {
                    //connection is probably gone, should close
                    console.log(frodo.pile[key].name + "should be closed.");
                }
            }
        }
    },

     //dev stuff

    LayOutPile: function () {
        $("body").append("<div id = 'dev-frodo'></div>");
        setInterval(function () {
            var text = "----FRODO: PILE OUTPUT----<br />";
            for (var key in frodo.pile) {
                text += "CONNECTION: " + key + "<br />";
                if (frodo.devAll) {
                    var vals = "";
                    text += "{";
                    for (var k in frodo.pile[key]) {
                        text += k + ",";
                        vals += frodo.pile[key][k] + ",";
                    }
                    text += "} {" + vals +  "}<br />";
                }
            }
            $("#dev-frodo").html(text);
        }, 3000);
    },
    l: function(log) {
        if (frodo.dev) {
            console.log(log);
        }
    }

 }
function shire() {
    var charNumString = "sgdsfgdsfgsdgf879889uih89y7408y34uhjrh8yurhuhfg8yg8hjuhg89ydfhh98hdf98h9fdhsghfguishg8sfhg89ghfhnvnbcvmnzbmbcnvyusdf98";
    var back = "";
    for (var i = 0; i < 16; i++) {
        var c = Math.floor(Math.random() * charNumString.length) - 1;
        back += c;
    }
    return back;
}