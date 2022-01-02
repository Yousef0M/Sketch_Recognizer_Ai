function rdp(points, a, b, epsilon, out_points) {
    var furthestIndex = findFurthest(points, a, b, epsilon);
    if (furthestIndex == -1)
        return -1

    rdp(points, a, furthestIndex, epsilon, out_points)

    out_points.push(points[furthestIndex])

    rdp(points, furthestIndex, b, epsilon, out_points)

}

function findFurthest(points, a, b, epsilon, returnIndex = true) {
    var maxDist = -1
    var maxIndex = 0
    for (var i = a + 1; i < b; i++) {
        let d = line_distance(points[i], points[a], points[b])
        if (d > maxDist) {
            maxDist = d
            maxIndex = i
        }
    }
    if (returnIndex && maxDist > epsilon)
        return maxIndex
    if (!returnIndex)
        return maxDist

    return -1
}

function line_distance(c, a, b) {
    x1 = a.x
    x2 = b.x
    y1 = a.y
    y2 = b.y

    x0 = c.x
    y0 = c.y

    d = Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1))
    d /= Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    return d
}