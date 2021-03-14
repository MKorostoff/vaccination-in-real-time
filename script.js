//Values that should be updated daily:
//todo: use github actions to update these programatically
const per_day = 2500000;
const doses_given = 105000000;
const cases_per_day =  56362;
//End transient values

//Fully static values
const doses_needed = 500000000;
const row_height = 40;
const total_height = 480;
const mini_height = 40;
const medium_height = 160;
const total_width = 300;
const person_width = 20;
var halfday;

//Computed values
const human_readable_per_day = per_day / 1000000;
const per_second = per_day/24/60/60;
const human_readable_per_second = Math.floor(per_second);
const cases_per_second = cases_per_day/24/60/60;
const speed_in_milliseconds = 1000/per_second;
const cases_speed_in_milliseconds = 1000/cases_per_second;
const doses_given_percent = doses_given/doses_needed;
//End computed values

//Dom elements
const open_time = document.getElementById('open-time');
const open_time_explainer = document.getElementById('open-time-explainer');
const twelve = document.getElementById('twelve');
const per_day_container = document.getElementById('per-day');
const per_second_container = document.getElementById('per-second');
const twenty_four_horizontal = document.getElementById('twenty_four_horizontal');
const twenty_four_vertical = document.getElementById('twenty_four_vertical');
const twelve_horizontal = document.getElementById('twelve_horizontal');
const twelve_vertical = document.getElementById('twelve_vertical');
const january_horizontal = document.getElementById('january_horizontal');
const january_vertical = document.getElementById('january_vertical');
const february_horizontal = document.getElementById('february_horizontal');
const february_vertical = document.getElementById('february_vertical');
const march_horizontal = document.getElementById('march_horizontal');
const march_vertical = document.getElementById('march_vertical');
const new_cases_horizontal = document.getElementById('new_cases_horizontal');
const new_cases_vertical = document.getElementById('new_cases_vertical');
const outpace_horizontal = document.getElementById('outpace_horizontal');
const outpace_vertical = document.getElementById('outpace_vertical');
const total_doses = document.getElementById('total-doses');
const doses_given_bar = document.getElementById('doses-given');
const button_group = document.getElementById('button-group');
const zoomin_button = document.getElementById('zoomin');
const zoomout_button = document.getElementById('zoomout');
const timer = document.getElementById('timer');
const prototypical_pixel = document.getElementById('prototypical-pixel');
const pixels = document.getElementById('pixels');
const total_doses_wrapper = document.getElementById('total-doses-wrapper');
//End dom elements

let progress_bars = {
  twenty_four: {width: 0, height: 0},
  twelve: {width: 0, height: 0},
  january: {width: 0, height: 0},
  february: {width: 0, height: 0},
  march: {width: 0, height: 0},
  outpace: {width: 0, height: 0},
  new_cases: {width: 0, height: 0}
}

//Init static elements
per_day_container.innerHTML = human_readable_per_day;
per_second_container.innerHTML = human_readable_per_second;
doses_given_bar.style.width = (doses_given_percent * 100) + '%';

function zoomin() {
  zoomin_button.style.display = 'none';
  zoomout_button.style.display = 'inline';
  total_doses_wrapper.scrollLeft = 0;
  total_doses.className = 'zoomed';
  let offset = total_doses.offsetWidth * doses_given_percent - 10;
  total_doses.style.transform = 'scale(10,10) translateX(-' + offset + 'px)';
}

function zoomout() {
  total_doses_wrapper.scrollLeft = 0;
  zoomin_button.style.display = 'inline';
  zoomout_button.style.display = 'none';
  total_doses.style.transform = 'none';
}

var time = Math.floor(1000/per_second);
var thousand_doses_from_now = new Date().getTime() + (time * 1000);
timer.innerHTML = time;

setInterval(function(){
  let now = new Date().getTime();
  let time_remaining = thousand_doses_from_now - now;
  let seconds = Math.floor((time_remaining % (60000)) / 1000);
  if (seconds < 1) {
    let new_pixel = prototypical_pixel.cloneNode();
    pixels.appendChild(new_pixel);
    thousand_doses_from_now = new Date().getTime() + (time * 1000);
  }
  timer.innerHTML = seconds;
}, 200)

setInterval(function(){
  increment_progress(
    twenty_four_horizontal,
    twenty_four_vertical,
    'twenty_four',
    total_height
  );
}, speed_in_milliseconds);


function startHalfDay(day_length, color, id) {
  button_group.className = 'button-group ' + id;
  let divisor = 24/day_length;
  twelve.className = 'people-outer ' + color;
  open_time.innerHTML = day_length;
  open_time_explainer.innerHTML = 'Vaccinating ' + human_readable_per_day + ' million people in <span class="open-time ' + color + '">' + day_length + '</span> hours';
  clearInterval(halfday);
  halfday = setInterval(function(){
    increment_progress(
      twelve_horizontal,
      twelve_vertical,
      'twelve',
      total_height
    );
  }, speed_in_milliseconds/divisor);
}
startHalfDay(8, 'green', 'eight-hours');

setInterval(function(){
  increment_progress(
    january_horizontal,
    january_vertical,
    'january',
    mini_height
  );
}, 338);

setInterval(function(){
  increment_progress(
    february_horizontal,
    february_vertical,
    'february',
    mini_height
  );
}, 64);

setInterval(function(){
  increment_progress(
    march_horizontal,
    march_vertical,
    'march',
    mini_height
  );
}, 47);

setInterval(function(){
  increment_progress(
    outpace_horizontal,
    outpace_vertical,
    'outpace',
    medium_height
  );
}, speed_in_milliseconds);

setInterval(function(){
  increment_progress(
    new_cases_horizontal,
    new_cases_vertical,
    'new_cases',
    medium_height
  );
}, cases_speed_in_milliseconds);

function increment_progress(horizontal, vertical, bar_id, height) {
  if (progress_bars[bar_id].width < total_width) {
    progress_bars[bar_id].width += person_width;
    horizontal.style.width = progress_bars[bar_id].width + 'px';
  }
  else if (progress_bars[bar_id].height < height - row_height) {
    progress_bars[bar_id].width = 0;
    horizontal.style.width = '0px';
    progress_bars[bar_id].height += row_height;
    vertical.style.height = progress_bars[bar_id].height + 'px';
  }
  else {
    vertical.style.height = '0px';
    horizontal.style.width = '0px';
    progress_bars[bar_id].width = 0;
    progress_bars[bar_id].height = 0;
  }
}
