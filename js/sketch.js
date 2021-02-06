/*jshint esversion: 8 */

let side, scl;
let items, border;
let dy, theta;
let max_dx, max_dy, max_theta, theta_direction, y_direction, x_direction;
let duration, fps, frame_offset, phase, mode;
let colors, palette;

let debug = false;
let record = false;
let recording_started = false;
let capturer;

function setup() {
  console.log("%cSnooping around? Check the repo! https://github.com/lorossi/trippy-animations", "color:white;font-size:1.5rem;");

  let w, h;

  if (record) {
    w = 1000;
    h = 1000;
    mode = 0;
  } else {
    w = h = min($(window).width(), $(window).height()) - 300;
    mode = parseInt(random(1, 8));
  }

  $("#sketch").prop("width", w);
  $("#sketch").prop("height", h );
  createCanvas(w, h);

  items = 12;
  border = 3;
  scl = max(width, height) / items;
  side = scl / sqrt(2);
  fps = 60;
  duration = 3;
  colors = [[color("#2ec4b6"), color("#fdfffc")], [color("#edf2f4"), color("#2b2d42")],
            [color("#ff6b6b"), color("#4ecdc4")], [color("#6d597a"), color("#e56b6f")],
            [color("#9e2a2b"), color("#e09f3e")], [color("#ef233c"), color("#edf2f4")],
            [color("#1a535c"), color("#ff6b6b")], [color("#ffd500"), color("#00509d")]
          ];

  frame_offset = 1;

  reset_variables();

  if (debug) {
    frameRate(1);
  } else {
    frameRate(fps);
  }
}

function draw() {
  if (mode == 2) {
    max_theta = PI;
    max_dx = scl;
    max_dy = 2 * scl;
  } else if (mode == 5) {
    max_theta = PI * (2 - phase);
    max_dx = scl;
    max_dy = scl;
  } else {
    max_theta = PI;
    max_dx = scl;
    max_dy = scl;
  }

  let percent = (frameCount - frame_offset) / (fps * duration);

  if (debug) {
    percent = 0.5;
    phase = frameCount % 2 == 0 ? 0 : 1;
  }

  if (percent >= 1) {
    frame_offset = frameCount;
    percent = 0;
    phase = phase == 0 ? 1 : 0;
  }

  if (percent == 0 && record && phase == 0) {
    if (!recording_started) {
      capturer = new CCapture({
        format: 'png',
        framerate: fps,
        motionBlurFrames: 1,
        name: `animation_${mode}`
      });

      console.log(`Started recording ${mode + 1}/${colors.length}`);
      capturer.start();
      recording_started = true;
    } else {
      capturer.stop();
      capturer.save();
      recording_started = false;
      console.log(`Completed recording ${mode + 1}/${colors.length}`);

      mode = mode + 1;
      if (mode == colors.length) {
        reset_variables();
        record = false;
        console.log("All completed");
      } else {
        reset_variables(mode);
      }
    }
  }

  dy = easeInOutSine(percent) * max_dy * y_direction;

  if (phase == 0) {
    if (percent < 0.5) {
      dx = x_direction * easeInOutQuad(percent * 2) * max_dx;
    } else {
      dx = - x_direction * easeInOutQuad((percent - 0.5) * 2) * max_dx + max_dx;
    }
  } else if (phase == 1) {
    if (percent < 0.5) {
      dx = - x_direction * easeInOutQuad(percent * 2) * max_dx;
    } else {
      dx = x_direction * easeInOutQuad((percent - 0.5) * 2) * max_dx - max_dx;
    }
  }


  theta = easeInOutSine(percent) * max_theta * theta_direction;

  push();
  background(palette[1-phase]);
  rectMode(CENTER);

    for (let x = -border; x < items + border; x++) {
      for (let y = -border; y < items + border; y++) {
        push();

        let fill_c = palette[phase];
        fill(fill_c);

        if (mode == 0) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + dt) + dx, scl * (y + dt) + dy);
          noStroke();
          rotate(PI/4 + theta);
          rect(0, 0, side, side);
        } else if (mode == 1) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + dt) + dx, scl * (y + dt) + dy);
          noStroke();
          rotate(theta);
          rect(0, 0, scl + 3, scl / 2);
        } else if (mode == 2) {
          translate(scl * x + dx, scl * y + dy);
          noStroke();
          rotate(theta);
          triangle(0, 0, scl, 0, 0, scl);
        } else if (mode == 3) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + dt) + dx, scl * y + dy);
          noStroke();
          rotate(theta);
          rect(0, 0, scl / 2, scl + 3);
        } else if (mode == 4) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + 0.5 + dt) + dx, scl * (y + 0.5 + dt) + dy);
          rotate(theta);
          if (phase == 0) {
            stroke(fill_c);
            rect(0, 0, scl / 4, scl);
            rect(0, 0, scl, scl / 4);
            noStroke();
            rect(0, 0, scl / 4 + 2, scl / 4 + 2);
          } else {
            noStroke();
            rect(0, 0, side + 3, side + 3);
          }
        } else if (mode == 5) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + 0.5 + dt) + dx, scl * (y + 0.5 + dt) + dy);
          rotate(-HALF_PI + theta);
          noStroke();
          if (phase == 0) {
            polygon(scl/2, 8);
          } else {
            rotate(-HALF_PI);
            star(scl/2, scl/5 + 1);
          }
        } else if (mode == 6) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + 0.5 + dt) + dx, scl * (y + 0.5 + dt) + dy);
          rotate(-HALF_PI + theta);
          noStroke();
          if (phase == 0) {
            arc(0, 0, scl, scl, 0, TWO_PI - HALF_PI, PIE);
          } else {
            rect(scl/4, -scl/4, scl/2, scl/2);
            astroid(scl);
          }
        } else if (mode == 7) {
          let dt = phase == 1 ? 0 : 0.5;
          translate(scl * (x + 0.5 + dt) + dx, scl * (y + 0.5 + dt) + dy);
          rotate(theta);
          noStroke();
          if (phase == 0) {
            rect(scl / 8, scl / 8, scl / 2, scl / 2);
            rect(-scl / 8, -scl / 8, scl / 2, scl / 2);
          } else {
            rect(scl / 8, -scl / 8, scl / 2, scl / 2);
            rect(-scl / 8, scl / 8, scl / 2, scl / 2);
            rect(scl / 2, 0, scl / 4 + 1, scl / 4);
            rect(0, -scl / 2, scl / 4, scl / 4 + 1);
          }
        }
        pop();
      }
    }
  pop();

  // record frame
  if (record) {
    capturer.capture(document.getElementById('defaultCanvas0'));
  }
}

function reset_variables(new_mode) {
  theta_direction = random(1) > 0.5 ? -1 : 1;
  y_direction = random(1) > 0.5 ? -1 : 1;
  x_direction = random(1) > 0.5 ? -1 : 1;
  mode = new_mode || 0;
  phase = 0;

  if (record) {
    palette = colors[mode];
  } else {
    palette = colors[parseInt(random(0, colors.length))];
  }
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function easeInOutSine(x) {
return -(cos(PI * x) - 1) / 2;
}

function polygon(radius, sides) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    let theta = TWO_PI / sides * i;
    let vx = radius * cos(theta);
    let vy = radius * sin(theta);
    vertex(vx, vy);
  }
  endShape();
}

function star(r1, r2) {
  radiuses = [r1, r2];
  beginShape();
  for (let i = 0; i < 8; i++) {
    let theta = TWO_PI / 8 * i;
    let vx = radiuses[i % 2] * cos(theta);
    let vy = radiuses[i % 2] * sin(theta);
    vertex(vx, vy);
  }
  endShape();
}

function astroid(r) {
  // this took me a loooooooong while to figure it out
  beginShape();
  let points = 10;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < points; j++) {
      let theta = ((4 - i) % 4) * HALF_PI + HALF_PI / points * j;
      let vx = r / 2 * cos(theta) + (i - 2 < 0 ? -1: 1) * r / 2;
      let vy = r / 2 * sin(theta) + (i == 0 || i == 3 ? -1 : 1) * r / 2;
      vertex(vx, vy);
    }
  }
  endShape();
}

function mouseClicked() {
  if (record) return;

  setInterval(() => $(".instructions").animate({"opacity": 0}, "slow"), 1000);
  let new_mode;
  do {
    new_mode = parseInt(random(1, colors.length));
  } while (new_mode === mode);
  reset_variables(new_mode);
}
