<script setup>

import { computed, ref, watch } from 'vue'
import { line, plot } from './svg_helper'
import { polarization_ellipse } from './polarization_ellipse'

const pe = polarization_ellipse()
const view_width = ref(100)
const view_height = ref(100)
const t0 = ref(0)
const v_max = ref(1)

function xy_arr_sample(t1, t2, samples) {
  const x_arr = []
  const y_arr = []
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1) * (t2 - t1) + t1
    const [x, y] = pe.time(t)
    x_arr.push(x)
    y_arr.push(y)
  }
  return [x_arr, y_arr]
}

const viewBox =
  computed(_ => `0 0 ${view_width.value} ${view_height.value}`)


// Common variables
const samples = 100
const f_arr = []
for (let i = 0; i < samples; i++) {
  f_arr.push(i / (samples - 1) * 2 - 1)
}

function transform(x_arr, x00, x01, x10, x11) {
  const single_value = typeof (x_arr) === 'number'
  if (single_value) x_arr = [x_arr]
  const new_arr = []
  for (let i = 0; i < x_arr.length; i++) {
    const x = (x_arr[i] - x00) / (x01 - x00) * (x11 - x10) + x10
    new_arr.push(x)
  }
  if (single_value) return new_arr[0]
  return new_arr
}

const layout_x_split = () => view_width.value * 0.6
const layout_y_split = () => view_height.value * 0.6
const split_margin = ref(5)

const to = {
  x1: x_arr => transform(x_arr, -v_max.value, v_max.value, 0, layout_x_split() - split_margin.value),
  x2: x_arr => transform(x_arr, -v_max.value, v_max.value, layout_x_split() + split_margin.value, view_width.value),
  y1: y_arr => transform(y_arr, -v_max.value, v_max.value, 0, layout_y_split() - split_margin.value),
  y2: y_arr => transform(y_arr, -v_max.value, v_max.value, layout_y_split() + split_margin.value, view_height.value),
  x01: x_arr => transform(x_arr, -1, 1, 0, layout_x_split() - split_margin.value),
  x02: x_arr => transform(x_arr, -1, 1, layout_x_split() + split_margin.value, view_width.value),
  y01: y_arr => transform(y_arr, -1, 1, 0, layout_y_split() - split_margin.value),
  y02: y_arr => transform(y_arr, -1, 1, layout_y_split() + split_margin.value, view_height.value),
}



const svg_content = computed(() => {
  const [x_arr, y_arr] = xy_arr_sample(0, Math.PI * 2, samples)
  const [x_arr_sine, y_arr_sine] = xy_arr_sample(t0.value, -Math.PI * 5 + t0.value, samples)
  const x0 = x_arr_sine[0]
  const y0 = y_arr_sine[0]

  return [
    // Ellipse
    plot(to.x1(x_arr), to.y1(y_arr),
      /*stroke=*/'#000000', /*fill=*/'none'),

    // X = cos
    plot(to.x1(x_arr_sine), to.y02(f_arr),
      /*stroke=*/'#000000', /*fill=*/'none'),
    line(
      to.x1(x0), to.y1(y0),
      to.x1(x0), to.y02(-1),
      /*stroke=*/'gray',
      /*thickness=*/0.3,
    ),

    // Y = cos
    plot(to.x02(f_arr), to.y1(y_arr_sine),
      /*stroke=*/'#000000', /*fill=*/'none'),
    line(
      to.x1(x0), to.y1(y0),
      to.x02(-1), to.y1(y0),
      /*stroke=*/'gray',
      /*thickness=*/0.3,
    ),

    // polarization vector
    line(
      to.x1(x0), to.y1(y0),
      to.x1(0), to.y1(0),
      /*stroke=*/'gray',
      /*thickness=*/0.3,
    ),
  ].join('')
})

let last_timestamp = 0
function update(timestamp) {
  let delta_time = timestamp - last_timestamp
  last_timestamp = timestamp
  t0.value += delta_time / 5000 * Math.PI * 2
  requestAnimationFrame(update)
}

update(0)

</script>

<template>
  <h1>Polarization Ellipse</h1>
  <div>
    <input type="number" name="" id="" v-model="view_width">
    <svg :viewBox="viewBox" v-html="svg_content">
    </svg>
  </div>
</template>

<style scoped></style>
