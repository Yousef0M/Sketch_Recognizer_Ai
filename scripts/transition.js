
start_button = document.getElementById('mainButton')

const pages = { "main": 1, "card": 2, "game": 3, "about": 4 }

var active_page = pages.main;

var drawing_index = -1
var drawing_history = []
function toggle_round_card(onlyOpen = false) {

    let desired_drawing_txt = document.getElementById('desired_drawing')
    let inner_desired_drawing_txt = document.getElementById('inner_desired_drawing')



    let card = document.getElementById('round-card')

    if (active_page != pages.card && active_page != pages.about || onlyOpen) {

        if (drawing_history.length > 20) {
            drawing_history.splice(0, 1);
        }

        // drawing_index = Math.floor(Math.random() * Object.keys(labels).length)
        drawing_index = Math.floor(Math.random() * 10)
        var i = 0
        while (i < drawing_history.length) {
            if (drawing_index == drawing_history[i]) {
                // drawing_index = Math.floor(Math.random() * Object.keys(labels).length)
                drawing_index = Math.floor(Math.random() * 22)
                i = -1
            }
            i++
        }
        drawing_history.push(drawing_index)

        desired_drawing_txt.textContent = labels[drawing_index];
        card.className = 'cover visible';

        setTimeout(function () {
            inner_desired_drawing_txt.textContent = 'Draw: ' + labels[drawing_index];

            init()
            stop_drawing()
        }, 250)

        active_page = pages.card;
    }
    else {
        card.className = 'cover invisible'
    }
}
function toggle_game_canvas() {
    if (active_page != pages.game) {
        let game = document.getElementById('game-canvas')
        game.style.display = 'flex'
        toggle_round_card()
        active_page = pages.game;
        start_drawing()
    } else {
        game = document.getElementById('game-canvas')
        game.style.display = 'none'
        stop_drawing()
        active_page = pages.main;
    }

}

function toggle_about() {
    if (active_page != pages.about) {
        let about = document.getElementById('about')
        about.className = 'cover about visible';
        active_page = pages.about;
        return
    }
    if (active_page == pages.about) {
        let about = document.getElementById('about')
        about.className = 'cover about invisible';
        active_page = pages.main;
    }
}

function enter_main() {
    toggle_game_canvas()
    drawing_history = []

}