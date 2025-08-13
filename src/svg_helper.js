function line(x1, y1, x2, y2, stroke = '#000000', thickness = 1) {
    const d = `M${x1},${y1} L${x2},${y2}`;
    return `<path d="${d}" stroke="${stroke}" stroke-width="${thickness}" fill="none"></path>`;
}

function plot(x_arr, y_arr, stroke = '#000000', fill = 'none', thickness = 1) {
    const d = []
    if (x_arr.length != y_arr.length) throw `x[${x_arr.length}] and y[${y_arr.length}] should be same length`
    for (let i = 0; i < x_arr.length; i++) {
        const x = x_arr[i]
        const y = y_arr[i]
        d.push((i == 0 ? "M" : "L") + `${x},${y}`)
    }
    return `<path d="${d.join(' ')}" stroke="${stroke}" stroke-width="${thickness}" fill="${fill}"></path>`;
}

export {
    line, plot
}