# Seasonal Map Themes (MapLibre GL JS)

A small demo showing one OpenStreetMap base style re-themed for different seasons: Winter, Autumn and Halloween, plus the default for comparison.

- Base style and vector tiles: [OpenFreeMap](https://openfreemap.org/) "Liberty", built on OpenStreetMap data.
- Each theme in `themes.js` is a palette of color overrides applied to groups of style layers (land, water, parks, roads, buildings, labels) in `app.js`.
- Pick a theme from the panel, or link straight to one with `#winter`, `#autumn` or `#halloween`.

## Run it

It's a static site with no build step. Serve the folder with any static server, for example:

```
npx serve .
```

then open the printed URL. Opening `index.html` directly also works in most browsers.

Map data © OpenStreetMap contributors.

## Seasonal icons and snow

Winter shows snowflake and pine markers, Autumn shows leaf markers, and Halloween shows pumpkins and bats. They're symbol layers inside the map style, placed on parks, woods and grass, so they pan, zoom and give way to labels like any other map feature. Use the "Seasonal icons" checkbox to hide them. Winter also has an optional "Falling snow" overlay that's off by default, never blocks panning or zooming, and is hidden for anyone who has reduced motion turned on.
