var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {

    const max_pads = 8;
    const max_tracks = 6;
    const max_steps = 16;
    var editMode = false;
    const duration = 1;

    //const notes = ['c3', 'd3', 'e3', 'f3', 'g3', 'a3', 'b3'];
    const notes = ['CM', 'Dm', 'Em', 'FM', 'GM', 'Am', 'Bm'];
    $scope.controls = [{ id: 1 }, { id: 2 }];



    $scope.clickedControl = function(event) {
        var control = event.control;
        changeState(control);
        switch (control.id) {
            case 1:
                document.documentElement.webkitRequestFullScreen();
                break;
            case 2:
                editMode = !editMode;
                break;
        }

    }

    var setStepDuration = function(track, step) {
        var nextScribble = ''
        var nextState = 0;

        if (step.state == 0) {
            step.scribble = '-';
            nextScribble = '-';
            nextState = 0;
        } else {
            step.scribble = 'x';
            nextScribble = '_';
            nextState = 2;
        }
        for (i = step.id; i < step.id + duration - 1; i++) {
            if (i < track.steps.length) {
                track.steps[i].scribble = nextScribble;
                track.steps[i].state = nextState;
            }
        }

    }

    // step states : 0 stopped, 1 playing, 2 extending prev note
    var changeState = function(something) {
        var state = something.state;
        if (state == 0) {
            something.state = 1;
        } else {
            something.state = 0;
        }

    }

    $scope.selectPad = function(event) {
        if ($scope.selectedPad) {
            $scope.selectedPad.selected = false;
        }
        if (!editMode) {
            changeState(event.pad);
            var activePads = $scope.pads.filter(function(pad) { return pad.state == 1 });
            sendMessage(JSON.stringify(activePads));
        }
        $scope.selectedPad = event.pad;
        $scope.selectedPad.selected = true;

    }

    $scope.clickedStep = function(track, step) {
        changeState(step);
        setStepDuration(track, step);
    };

    $scope.pads = [];
    $scope.tracks = [];
    $scope.steps = [];

    for (i = 1; i <= max_pads; i++) {
        var aPad = {
            id: i,
            channel: i - 1, // channel starts from 0
            state: 0,
            tracks: []
        }

        for (j = 1; j <= max_tracks; j++) {
            var track = {
                id: j,
                note: notes[8 - j - 1],
                steps: []
            }

            for (k = 1; k <= max_steps; k++) {
                var step = {
                    id: k,
                    state: 0,
                    scribble: '-'

                }
                track.steps.push(step);
            }

            aPad.tracks.push(track);
        }


        $scope.pads.push(aPad);
    }

});