// Each theme overrides colors of the base style by layer group.
window.THEMES = [
  { id: "default", name: "Default", desc: "The untouched OpenStreetMap base style, for comparison.", swatch: ["#f8f4f0","#a0c8f0","#d8e8c8","#fc8"] },
  { id: "winter", name: "Winter", desc: "Snow-white land, icy blue water, frosted parks with snowflake and pine markers, and cool slate roads.",
    swatch: ["#f4f7fb","#9cc3e4","#dfe8ee","#7d8fa6"], icons: ["snowflake","pine"], effect: "snow",
    colors: { background:"#f4f7fb", residential:"#eaf0f6", park:"#dfe8ee", wood:"#cfdce4", grass:"#e4ecf1", water:"#9cc3e4", waterLine:"#88b4da",
      building:"#dde4ec", buildingOutline:"#c5cfdb", roadMajor:"#7d8fa6", roadMinor:"#ffffff", roadCasing:"#c8d3df", rail:"#b0bccb",
      label:"#2b3f57", labelHalo:"#ffffff", waterLabel:"#3f6f99", boundary:"#9aa9bb" } },
  { id: "autumn", name: "Autumn", desc: "Warm parchment land, orange and rust foliage with leaf markers in parks, deep teal water.",
    swatch: ["#f6ecdc","#5f9ea0","#e3a15a","#b5542a"], icons: ["leaf-orange","leaf-rust"],
    colors: { background:"#f6ecdc", residential:"#efe0c9", park:"#e8b878", wood:"#d98c4a", grass:"#ecc58e", water:"#5f9ea0", waterLine:"#4d8a8c",
      building:"#e4cfb2", buildingOutline:"#cdb08c", roadMajor:"#b5542a", roadMinor:"#fffaf0", roadCasing:"#d6b892", rail:"#9c7a5a",
      label:"#4a2c17", labelHalo:"#fbf3e6", waterLabel:"#2f6466", boundary:"#a0663a" } },
  { id: "halloween", name: "Halloween", desc: "A night-mode style: near-black land, purple water, glowing orange roads, pumpkins and bats in the parks.",
    swatch: ["#17141f","#3b2556","#2a3a22","#ff7a1a"], icons: ["pumpkin","bat"],
    colors: { background:"#17141f", residential:"#1e1a28", park:"#1f2b1c", wood:"#18241a", grass:"#222f1e", water:"#3b2556", waterLine:"#4c3070",
      building:"#28232f", buildingOutline:"#3a3346", roadMajor:"#ff7a1a", roadMinor:"#4a4058", roadCasing:"#0d0b12", rail:"#5a4f6a",
      label:"#ffb366", labelHalo:"#0d0b12", waterLabel:"#c9a6ff", boundary:"#8a5cc2" } }
];
