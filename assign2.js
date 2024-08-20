
$(document).ready(function () {
    try {
        var minutes = 0;
        var seconds = 0;
        var timer;
        const width = 19;
        const height = 11;
        const board = [];
        for (i = 0; i < width; i++) {
            board[i] = [];
        }
        const mines = 30;
        var minesRemaining;
        function isGameWon() {
            // check if game is won
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++) {
                    if (parseInt(board[i][j].attr('covered')) && parseInt(board[i][j].attr('num')) < 9) {
                        return false;
                    }
                }
            }
            return true;
        }


        function initializeGame() {


            // create tiles
            let str = "";
            let shade = 0;
            for (j = 0; j < height; j++) {
                str += "<ul>"
                for (i = 0; i < width; i++) {
                    str += "<li><img src='images/tile_c" + shade + ".png' class='tile' tileX='" + i + "' tileY='" + j + "' num='0' covered='1' flagged='0' shade='" + shade + "'></li>";
                    shade = (shade == 0) ? 1 : 0;
                }
                str += "</ul>"
            }
            $('#game-board').html(str);

            // fill board
            $('.tile').each(function () {
                board[parseInt($(this).attr('tileX'))][parseInt($(this).attr('tileY'))] = $(this);
            });

            // generate mines and nums
            minesRemaining = mines;
            $('#minesRemaining').html(minesRemaining);

            for (n = 0; n < mines; n++) {
                x = Math.floor(Math.random() * width);
                y = Math.floor(Math.random() * height);
                tile = board[x][y];

                if (parseInt(tile.attr('num')) < 9) {
                    // make mine
                    tile.attr('num', 9);
                    // set nums of surrounding tiles
                    for (i = x - 1; i <= x + 1; i++) {
                        for (j = y - 1; j <= y + 1; j++) {
                            if (i < 0 || i >= width || j < 0 || j >= height) continue;
                            board[i][j].attr('num', parseInt(board[i][j].attr('num')) + 1);
                        }
                    }
                }
                else {
                    // select another tile
                    n--;
                }
            }

            // flag tile on right click
            $('.tile').on('contextmenu', function () {
                if (!parseInt($(this).attr('covered'))) return false;
                if (parseInt($(this).attr('flagged'))) {
                    $(this).attr('flagged', 0);
                    $(this).attr('src', $(this).attr('src').replace("f", "c"));
                    minesRemaining++;
                }
                else {
                    $(this).attr('flagged', 1);
                    $(this).attr('src', $(this).attr('src').replace("c", "f"));
                    minesRemaining--;
                }
                $('#minesRemaining').html(minesRemaining);
                return false;
            });

            // reveal tile on click
            $('.tile').on('click', function () {
                if (parseInt($(this).attr('flagged'))) return;
                if (parseInt($(this).attr('covered'))) {

                    // reveal tile
                    $(this).attr('covered', 0);
                    num = parseInt($(this).attr('num'));
                    $(this).attr('src', $(this).attr('src').replace("c", (num >= 9) ? "m" : num));


                    if (num == 0) {
                        // clear all tiles surrounding a zero
                        let x = parseInt($(this).attr('tileX'));
                        let y = parseInt($(this).attr('tileY'));
                        for (i = x - 1; i <= x + 1; i++) {
                            for (j = y - 1; j <= y + 1; j++) {
                                if (i < 0 || i >= width || j < 0 || j >= height) continue;
                                setTimeout(function (i, j) { board[i][j].click(); }, 50, i, j);
                            }
                        }
                    }
                    if (num >= 9) {
                        // lose state

                        // reveal all mines
                        $('.tile').each(function () {
                            if (parseInt($(this).attr('num')) >= 9) {
                                $(this).attr('src', "images/tile_m" + $(this).attr('shade') + ".png");
                            }
                        });

                        // remove listeners
                        $('.tile').off('click');
                        $('.tile').off('contextmenu');
                        // stop timer
                        clearInterval(timer);

                        $('#loseBanner').slideDown(1000);
                    }

                    if (isGameWon()) {
                        // win state

                        // remove listeners
                        $('.tile').off('click');
                        $('.tile').off('contextmenu');
                        // stop timer
                        clearInterval(timer);

                        $('#winBanner').slideDown(1000);
                    }
                }
                /*
                else {
                    // tile is already uncovered
                    if (parseInt($(this).attr('num')) === 0) return;
                    //alert('hi');
                    let x = parseInt($(this).attr('tileX'));
                    let y = parseInt($(this).attr('tileY'));
                    let nflags = 0;
                    for (i = x - 1; i <= x + 1; i++) {
                        for (j = y - 1; j <= y + 1; j++) {
                            if (i < 0 || i >= width || j < 0 || j >= height) continue;
                            if (parseInt(board[i][j].attr('flagged'))) nflags++;
                        }
                    }
                    if (parseInt($(this).attr('num')) === nflags) {
                        for (i = x - 1; i <= x + 1; i++) {
                            for (j = y - 1; j <= y + 1; j++) {
                                if (i < 0 || i >= width || j < 0 || j >= height) continue;
                                setTimeout(function (i, j) { board[i][j].click(); }, 50, i, j);
                            }
                        }
                    }
                        
                }
                    */

            });



        }

        // activate replay button
        $('#restart').on('click', function () {
            $('#restart').html('<h4>Restart</h4>');
            $('#loseBanner').hide();
            $('#winBanner').hide();
            seconds = 0;
            minutes = 0;
            $('#timer').html("0m 0s");
            clearInterval(timer);
            timer = setInterval(function () {
                seconds++;
                if (seconds == 60) {
                    seconds = 0;
                    minutes++;
                }
                $('#timer').html(minutes + "m " + seconds + "s");
            }, 1000);
            initializeGame();
        });
        $('#loseBanner').hide();
        $('#winBanner').hide();
    }
    catch (err) {
        alert(err);
    }
});
