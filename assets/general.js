var MOVE_DATA = {
    y: [0, 0, 0, 0, 0, 0, 2.898550724637681, 2.898550724637681, 2.898550724637681, 2.898550724637681, 2.898550724637681, 2.898550724637681, 5.797101449275362, 5.797101449275362, 5.797101449275362, 5.797101449275362, 8.695652173913043, 8.695652173913043, 8.695652173913043, 11.594202898550725, 11.594202898550725, 11.594202898550725, 14.492753623188406, 14.492753623188406, 14.492753623188406, 17.391304347826086, 17.391304347826086, 20.28985507246377, 20.28985507246377, 23.18840579710145, 23.18840579710145, 26.08695652173913, 26.08695652173913, 28.985507246376812, 28.985507246376812, 31.884057971014492, 31.884057971014492, 34.78260869565217, 34.78260869565217, 37.68115942028985, 37.68115942028985, 40.57971014492754, 40.57971014492754, 43.47826086956522, 43.47826086956522, 46.3768115942029, 49.27536231884058, 49.27536231884058, 52.17391304347826, 52.17391304347826, 55.072463768115945, 55.072463768115945, 57.971014492753625, 60.869565217391305, 60.869565217391305, 63.768115942028984, 63.768115942028984, 66.66666666666667, 69.56521739130434, 69.56521739130434, 72.46376811594203, 72.46376811594203, 75.3623188405797, 75.3623188405797, 78.26086956521739, 81.15942028985508, 81.15942028985508, 84.05797101449275, 84.05797101449275, 86.95652173913044, 86.95652173913044, 89.85507246376811, 89.85507246376811, 92.7536231884058, 95.65217391304348, 95.65217391304348, 98.55072463768116, 98.55072463768116, 101.44927536231884, 101.44927536231884, 101.44927536231884, 104.34782608695652, 104.34782608695652, 107.2463768115942, 107.2463768115942, 110.14492753623189, 110.14492753623189, 110.14492753623189, 113.04347826086956, 113.04347826086956, 115.94202898550725, 115.94202898550725, 115.94202898550725, 118.84057971014492, 118.84057971014492, 118.84057971014492, 118.84057971014492, 121.73913043478261, 121.73913043478261, 121.73913043478261, 121.73913043478261, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203, 124.6376811594203],
    x: [-3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.647887323943662, -3.619718309859155, -3.619718309859155, -3.591549295774648, -3.563380281690141, -3.535211267605634, -3.47887323943662, -3.4225352112676055, -3.3943661971830985, -3.3098591549295775, -3.2535211267605635, -3.169014084507042, -3.112676056338028, -3.028169014084507, -2.943661971830986, -2.859154929577465, -2.7464788732394365, -2.6619718309859155, -2.549295774647887, -2.436619718309859, -2.352112676056338, -2.23943661971831, -2.098591549295775, -1.9859154929577465, -1.8732394366197183, -1.76056338028169, -1.619718309859155, -1.4788732394366195, -1.3661971830985915, -1.2253521126760565, -1.084507042253521, -.943661971830986, -.8028169014084505, -.6619718309859155, -.52112676056338, -.380281690140845, -.21126760563380298, -.07042253521126751, .07042253521126751, .21126760563380298, .352112676056338, .492957746478873, .6338028169014089, .774647887323944, .915492957746479, 1.028169014084507, 1.169014084507042, 1.309859154929578, 1.450704225352113, 1.563380281690141, 1.704225352112676, 1.816901408450704, 1.929577464788733, 2.070422535211268, 2.183098591549296, 2.295774647887324, 2.408450704225352, 2.52112676056338, 2.605633802816902, 2.71830985915493, 2.802816901408451, 2.887323943661972, 2.971830985915493, 3.056338028169014, 3.140845070422535, 3.225352112676056, 3.281690140845071, 3.338028169014085, 3.394366197183099, 3.450704225352113, 3.507042253521127, 3.535211267605634, 3.563380281690141, 3.591549295774648, 3.619718309859155, 3.647887323943662, 3.647887323943662, 3.647887323943662],
    rotate: [-1.1781609195402298, -1.1781609195402298, -1.1781609195402298, -1.1781609195402298, -1.1781609195402298, -1.1666666666666665, -1.1666666666666665, -1.1551724137931034, -1.14367816091954, -1.14367816091954, -1.132183908045977, -1.1206896551724137, -1.1091954022988506, -1.0977011494252873, -1.0747126436781609, -1.0632183908045976, -1.0402298850574712, -1.028735632183908, -1.0172413793103448, -.9942528735632183, -.9712643678160919, -.9597701149425286, -.9367816091954022, -.9137931034482758, -.8908045977011494, -.867816091954023, -.8448275862068966, -.82183908045977, -.7988505747126436, -.7758620689655171, -.7528735632183907, -.7183908045977011, -.6954022988505747, -.6724137931034482, -.6379310344827586, -.6149425287356322, -.5804597701149425, -.557471264367816, -.5229885057471264, -.5, -.4655172413793103, -.43103448275862066, -.40804597701149425, -.37356321839080453, -.3505747126436781, -.3160919540229885, -.2816091954022988, -.24712643678160917, -.22413793103448276, -.18965517241379304, -.15517241379310343, -.1206896551724137, -.0862068965517242, -.06321839080459757, -.028735632183908066, .005747126436781658, .04022988505747138, .07471264367816088, .09770114942528729, .13218390804597702, .16666666666666674, .20114942528735646, .22413793103448287, .2586206896551724, .2931034482758621, .3275862068965518, .35057471264367823, .38505747126436773, .41954022988505746, .44252873563218387, .4770114942528736, .5, .5344827586206897, .5574712643678161, .5919540229885059, .6149425287356323, .6494252873563218, .6724137931034484, .6954022988505748, .7298850574712643, .7528735632183907, .7758620689655173, .7988505747126438, .8218390804597702, .8448275862068968, .867816091954023, .8908045977011496, .9137931034482758, .9367816091954024, .9482758620689657, .9712643678160919, .9942528735632186, 1.0057471264367814, 1.028735632183908, 1.0402298850574714, 1.0517241379310347, 1.0747126436781609, 1.0862068965517242, 1.0977011494252875, 1.1091954022988504, 1.1206896551724137, 1.132183908045977, 1.1436781609195403, 1.1436781609195403, 1.1551724137931036, 1.1551724137931036, 1.1666666666666665, 1.1666666666666665, 1.1666666666666665, 1.1666666666666665, 1.1781609195402298]
};

function lerp(array, progress) {
    var n = (array.length - 1) * progress;
    var i = parseInt(n);
    var r = n - i;
    if (i >= array.length - 1) return array[array.length - 1];
    return array[i] * (1 - r) + array[i + 1] * r;
}

window.animateLoadingCanvas = function() {
    var canvas = document.getElementById("loading-canvas");
    var loadingOverlay = document.getElementById("loading-overlay");
    if (!canvas || !loadingOverlay) return;
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.src = "/assets/en/loading/@2x-se6335ab797-cb27d69f23a4d1112bc2a0d272538f39dd3017be20e5f2e3f4a460bd0071b68d.png";
    var frameWidth = 100, frameHeight = 100, totalFrames = 17;
    var currentFrame = 0, lastUpdateTime = 0, animationId;
    
    image.onload = function() {
        function animate(timestamp) {
            if (!timestamp) timestamp = 0;
            if (loadingOverlay.style.display === "none") {
                cancelAnimationFrame(animationId);
                return;
            }
            if (!lastUpdateTime) lastUpdateTime = timestamp;
            if (timestamp - lastUpdateTime > 10) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, currentFrame * frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
                currentFrame = (currentFrame + 1) % totalFrames;
                lastUpdateTime = timestamp;
            }
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    };
}

var SQUID_CONFIG = {
    count: 5,
    u: 18,
    frameSize: 64,
    totalFrames: 8,
    fps: 30,
    imageSrc: "/assets/ika-8e075a29ff487983044303f98958fb8c852bc3e9ab07ee7597724b6c0aa4a5d7.png"
};

window.initSquids = function() {
    var canvas = document.getElementById("squid-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var squids = [];
    var image = new Image();
    image.src = SQUID_CONFIG.imageSrc;
    
    var lastTime = 0;
    var interval = 1000 / SQUID_CONFIG.fps;

    function createSquid() {
        return {
            baseX: Math.random() * (canvas.width - SQUID_CONFIG.frameSize),
            baseY: canvas.height + (Math.random() * 500),
            x: 0, y: 0,
            invertX: Math.random() > 0.5,
            scale: 1 - Math.random() / 3,
            imageFrame: Math.random() * SQUID_CONFIG.u,
            speed: 0.5,
            drift: 0.2 + (Math.random() * 0.3)
        };
    }

    function animate(currentTime) {
        requestAnimationFrame(animate);
        var elapsed = currentTime - lastTime;
        if (elapsed > interval) {
            lastTime = currentTime - (elapsed % interval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < squids.length; i++) {
                var f = squids[i], d = f.imageFrame / SQUID_CONFIG.u;
                f.baseY -= f.drift;
                f.x = f.baseX + lerp(MOVE_DATA.x, d) * (f.invertX ? -1 : 1);
                f.y = f.baseY - lerp(MOVE_DATA.y, d);
                var rotate = lerp(MOVE_DATA.rotate, d);
                f.imageFrame += f.speed;
                if (f.imageFrame >= SQUID_CONFIG.u) {
                    f.imageFrame = 0;
                    f.baseY -= MOVE_DATA.y[MOVE_DATA.y.length - 1];
                    f.baseX += (MOVE_DATA.x[MOVE_DATA.x.length - 1] || 0) * (f.invertX ? -1 : 1);
                    f.invertX = !f.invertX;
                }
                ctx.save();
                ctx.translate(f.x + (SQUID_CONFIG.frameSize * f.scale) / 2, f.y + (SQUID_CONFIG.frameSize * f.scale) / 2);
                ctx.rotate(rotate * Math.PI / 180);
                ctx.scale(f.scale, f.scale);
                var spriteIdx = Math.floor(f.imageFrame) % SQUID_CONFIG.totalFrames;
                ctx.drawImage(image, spriteIdx * SQUID_CONFIG.frameSize, 0, SQUID_CONFIG.frameSize, SQUID_CONFIG.frameSize, -SQUID_CONFIG.frameSize/2, -SQUID_CONFIG.frameSize/2, SQUID_CONFIG.frameSize, SQUID_CONFIG.frameSize);
                ctx.restore();
                if (f.y < -150) squids[i] = createSquid();
            }
        }
    }

    image.onload = function() {
        for (var i = 0; i < SQUID_CONFIG.count; i++) squids.push(createSquid());
        requestAnimationFrame(animate);
    };
}

window.initDropdown = function() {
    var $toggle = $('#dropdownToggle');
    var $optionsList = $('#dropdownOptions');
    var $selectedImg = $('#selected-img');

    if ($toggle.length) {
        $toggle.off('click').on('click', function(e) {
            e.stopPropagation();
            $optionsList.toggleClass('show');
        });

        $optionsList.off('click').on('click', 'li', function() {
            var newSrc = $(this).attr('data-src');
            $selectedImg.attr('src', newSrc);
            $optionsList.removeClass('show');
        });

        $(document).off('click.dropdown').on('click.dropdown', function() {
            $optionsList.removeClass('show');
        });
    }
}

window.loadHeaderCallbacks = [];
window.loadHeader = function(callback) {
    if (window.headerLoaded) {
        callback(document.getElementById("header-container"));
    } else {
        window.loadHeaderCallbacks.push(callback);
    }
};

fetch("../header.html")
    .then(res => res.text())
    .then(html => {
        const container = document.getElementById("header-container");
        if (container) {
            container.innerHTML = html;
            window.headerLoaded = true;
            window.loadHeaderCallbacks.forEach(cb => cb(container));
        }
    })
    .catch(err => console.error("Header load failed:", err));
    
$(document).ready(function() {
    window.animateLoadingCanvas();
    window.initSquids();

    window.loadHeader(function() {
        window.initDropdown();
    });
});