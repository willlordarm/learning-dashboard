function initialise(days){

    // Set SVG size and margins for main charts

  width = 590; // X axis
  height = 250; // Y axis
  margin = 29;

  // Set SVG width for snapshot charts

  snapshotWidth = 255;
  snapshotHeight = 253;

  // Add SVGs

  var svg2 = d3.select("div#overall-vis").append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("class", "overall");

  var svg3 = d3.select("div#scatter-vis").append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("class", "scatter");

  var svg1 = d3.select("div#average-vis").append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("class", "average");

  var svg4 = d3.select("div#rewards-vis").append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("class", "rewards");

  var svgTotalWork = d3.select("div#total-complete-vis").append("svg")
      .attr("height", snapshotHeight)
      .attr("width", snapshotWidth)
      .attr("class", "total-work");

  var svgAverageScore = d3.select("div#average-score-vis").append("svg")
      .attr("height", snapshotHeight)
      .attr("width", snapshotWidth)
      .attr("class", "average-score");

  var svgRetries = d3.select("div#retries-vis").append("svg")
      .attr("height", snapshotHeight)
      .attr("width", snapshotWidth)
      .attr("class", "retries");

  var svgLogins = d3.select("div#logins-vis").append("svg")
      .attr("height", snapshotHeight)
      .attr("width", snapshotWidth)
      .attr("class", "logins");

  var svgLogins = d3.select("div#rewards-created-vis").append("svg")
          .attr("height", snapshotHeight)
          .attr("width", snapshotWidth)
          .attr("class", "rewards-created");

  var svgLogins = d3.select("div#rewards-collected-vis").append("svg")
          .attr("height", snapshotHeight)
          .attr("width", snapshotWidth)
          .attr("class", "rewards-collected");

  var svgBadges = d3.select("div#badges-vis").append("svg")
          .attr("height", snapshotHeight)
          .attr("width", snapshotWidth)
          .attr("class", "badges-unlocked");

  var svgHealth = d3.select("div#health-vis").append("svg")
          .attr("height", snapshotHeight)
          .attr("width", snapshotWidth)
          .attr("class", "health");

  var svgHealth = d3.select("div#ed-av-vis").append("svg")
          .attr("height", snapshotHeight)
          .attr("width", snapshotWidth)
          .attr("class", "edplace-average");

allViz(days);
};
