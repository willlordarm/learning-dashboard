// Function to draw all visualisations - includes separate functions for logins, badges and rewards

function allViz(period) {

  // Set dates for period
  today = d3.time.day(new Date());
  cutoffDate = d3.time.day.offset(new Date(), -period); // get current date/time

  // Set comparison period cut off
  compareDate = d3.time.day.offset(new Date(), - (2 * period));

  // Set string equivalent of time period for display
  periodReadable = function() {
    if(period == 7) {
      return "week";
    }
    else if(period == 30) {
      return "month";
    }
  };

  // Set correct number of ticks for x axis for each period
  tickNumber = function() {
    if (period == 7) {
      return period;
    }
    else if (period == 30) {
      return 6;
    }
  };

  // Format dates depending on period selected
  getTickFormat = function() {
    if (period == 7) {
      return "%a %d";
    }
    else if (period == 30) {
      return "%d %b";
    }
  };

  // Set the rounding for x axis scale depending on period. Rounds to day or week instead of cutting off in the middle.
  niceFormat = function() {
    if (period == 7) {
      return d3.time.day;
    }
    else if (period == 30) {
      return d3.time.week;
    }
  };

  // Displays the current period as text in the top bar
  d3.select('span.period')
  .text(periodReadable());

  // Function for formatting dates

  formatDate = d3.time.format("%Y-%m-%d").parse;

  // Function for formatting mean averages to remove decimals

  var formatMean = d3.format('.0f'); // Removes decimal places

  // Sets x translate for all large circles
  circleXtranslate = 130;

  // Color scales for scatter plot
  subjectColorScale = d3.scale.ordinal().domain(["Maths", "English", "Science"]).range(["#f26466","#f49c14", "#3598dc"]);

  // Set scales
  xScale = d3.time.scale().domain([d3.time.day.offset(new Date(), - (period -1)), today]).nice(niceFormat()).range([margin, width - margin]);
  yScale = d3.scale.linear().domain([100, 0]).range([margin, height - margin]);

  // Set axes
  xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(tickNumber()).tickFormat(d3.time.format(getTickFormat()));
  yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

  // Draw axes
  d3.select("svg.average").append("g").attr("id", "xAxis").attr("transform", "translate(0, " + (height - margin) + ")").call(xAxis);
  d3.select("svg.average").append("g").attr("id", "yAxisG").attr("transform", "translate(" + margin + ", 0)").call(yAxis);

  // Set gridlines
  xGrid = d3.svg.axis().scale(xScale).orient("bottom").ticks(tickNumber()).tickSize(-(height - (2 * margin)), 0, 0).tickFormat("");
  yGrid = d3.svg.axis().scale(yScale).orient("left").ticks(10).tickSize(-(width - (2 * margin)), 0, 0).tickFormat("");

  // Draw grid lines
  d3.select("svg.average").append("g").attr("class", "grid").attr("transform", "translate(0, " + (height - margin)  + ")").call(xGrid);
  d3.select("svg.average").append("g").attr("class", "grid").attr("transform", "translate(" + margin + ", 0)").call(yGrid);

  //  Get worksheets data and set the global worksheet data variable
  d3.json("php/oldstudent-worksheets.php", function(json) {
       render(json);
  });

  // Render visualisations based on worksheet data
  function render(data) {

  // Format dates correctly
    data.results.forEach(function(d) {
      d.dateAppeared = formatDate(d.dateAppeared);
      });

    // Filter out data for period (i.e. last 7 days or last 30 days)
    periodData = data.results.filter(function (d) {
      return d.dateAppeared > cutoffDate; // Should be able to replace this with a d3 date interval
    });

    // Filter for previous period
    dataToCompare = data.results.filter(function (d) {
      return d.dateAppeared > compareDate && d.dateAppeared < cutoffDate;
    });

    // Nest data by day and subject

    var subjectDataToNest = periodData;
    nestedSubjectData = d3.nest()
      .key(function(el) {return el.subject})
      .key(function(el) {return el.dateAppeared})
      .sortKeys(d3.ascending)
      .rollup(function(leaves) {
        return {
                "averageScore" : d3.mean(leaves, function(d) {return(d.Percentage)})
              }
      })
      .entries(subjectDataToNest);

   // Converts each key to a JS date object

      nestedSubjectData.forEach(function(d) {
        d.values.forEach(function(e) {
          e.key = new Date(e.key);
        });
        d.values.sort(function (a,b) {
          return a.key - b.key;
          });
      });

  // Nest data by day and get average overall

     var overallDataToNest = periodData;
        nestedOverallData = d3.nest()
          .key(function(el) {return el.dateAppeared})
          .entries(overallDataToNest);

     nestedOverallData.forEach(function (el) {
        el.totalWorksheets = el.values.length;
        el.averageScore = d3.mean(el.values, function(d) {
          return d.Percentage;
        });
        el.key = new Date(el.key);
      });

      // Sorts nested array by date
      nestedOverallData.sort(function (a,b) {
        return a.key - b.key;
      });

        // Get the maximum number of worksheets completed for any day in the selected period
			maxWorksheetsCompleted = d3.max(nestedOverallData, function(d) { return d.totalWorksheets;});


// Set a y scale based on max number of worksheets but only apply if this number is 5 or greater
			yScaleOverallMax = function() {
				if (maxWorksheetsCompleted < 10) {
					return 10;
				}
				else {
					return maxWorksheetsCompleted;
				}
			};


      // Set y scale for Overview chart
      yScaleOverall = d3.scale.linear().domain([yScaleOverallMax(), 0]).range([margin, height - margin]).clamp(true);

      // Set y axis for overview chart
      yAxisOverall = d3.svg.axis().scale(yScaleOverall).orient("left").ticks(5);

      // Draw axes for overview
      d3.select("svg.overall").append("g").attr("id", "xAxisOverall").attr("transform", "translate(0, " + (height - margin) + ")").call(xAxis);
      d3.select("svg.overall").append("g").attr("id", "yAxisOverall").attr("transform", "translate(" + margin + ", 0)").call(yAxisOverall);

      // Set y gridlines for overview
      yGridOverall = d3.svg.axis().scale(yScaleOverall).orient("left").ticks(5).tickSize(-(width - (2 * margin)), 0, 0).tickFormat("");

      // Draw grid lines for overview
      d3.select("svg.overall").append("g").attr("class", "grid").attr("transform", "translate(0, " + (height - margin)  + ")").call(xGrid);
      d3.select("svg.overall").append("g").attr("class", "grid").attr("transform", "translate(" + margin + ", 0)").call(yGridOverall);

  // ------------------------------------------
  // This section draws the number of worksheets completed on the overview chart
  // ------------------------------------------

      // Draw circles for worksheets completed by day

      d3.select("svg.overall")
      .selectAll("circle.overview-circle")
      .data(nestedOverallData)
      .enter()
      .append("circle")
      .attr("class", "overview-circle")
      .attr("r", 4)
      .attr("cy", function (d) {return yScaleOverall(d.totalWorksheets)})
      .attr("cx", function(d) {return xScale(d.key)});

      //Draw line
      var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
          return xScale(d.key);
        })
        .y(function(d) {
          return yScaleOverall(d.totalWorksheets);
        })

      var path =  d3.select("svg.overall")
        .data(nestedOverallData)
        .append("path")
        .attr("class", "overview-line")
        .attr("d", line(nestedOverallData));

      // Tooltips for overview worksheets completed data

      var overviewCompletedTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "" + d.totalWorksheets + " worksheets completed";
      })

      d3.selectAll("circle.overview-circle").call(overviewCompletedTip);
      d3.selectAll("circle.overview-circle").on('mouseover', overviewCompletedTip.show).on('mouseout', overviewCompletedTip.hide);

  // ------------------------------------------
  // This section draws the worksheet scatter plot
  // ------------------------------------------

      // Draw axes
      d3.select("svg.scatter").append("g").attr("id", "xAxisScatter").attr("transform", "translate(0, " + (height - margin) + ")").call(xAxis);
      d3.select("svg.scatter").append("g").attr("id", "yAxisScatter").attr("transform", "translate(" + margin + ", 0)").call(yAxis);

      // Draw grid lines
      d3.select("svg.scatter").append("g").attr("class", "grid").attr("transform", "translate(0, " + (height - margin)  + ")").call(xGrid);
      d3.select("svg.scatter").append("g").attr("class", "grid").attr("transform", "translate(" + margin + ", 0)").call(yGrid);

      d3.select("svg.scatter")
      .selectAll("circle")
      .data(periodData)
      .enter()
      .append("circle")
      .attr("class", function(d) {return d.subject})
      .attr("r", 4)
      .attr("cy", function(d) {return yScale(d.Percentage)})
      .attr("cx", function(d) {return xScale(d.dateAppeared)})
      .attr("stroke", function(d) {return subjectColorScale(d.subject)}) // Sets stroke color based on subject - very ugly!
      .attr("stroke-width", 2.5);

      var scatterTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "" + d.worksheetName + ": " + d.Percentage + "%";
      })

      d3.selectAll("svg.scatter > circle").call(scatterTip);
      d3.selectAll("svg.scatter > circle").on('mouseover', scatterTip.show).on('mouseout', scatterTip.hide);

      // Add Keys/legend to Scatter plot

      d3.select("svg.worksheet-legend")
      .append("g")
      .attr("id", "key")
      .attr("transform", "translate(75, 3)")
      .selectAll("g")
      .data(nestedSubjectData)
      .enter()
      .append("g")
      .attr("class", "scatterKey")
      .attr("transform", function(d,i){
          return "translate(" + (i * 63) + ",0)"});

    subjectKey = d3.selectAll("g.scatterKey");

    subjectKey
      .append("rect")
      .attr("class", function(d){return d.key;})
      .attr("width", 58)
      .attr("height", 24)
      .attr("rx", 5)
      .attr("ry", 5);

    subjectKey
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", 16)
      .attr("x", 29)
      .text(function(d){return d.key;});

    subjectKey
      .on("click", function() {

        if (d3.select(this).attr('class') === 'scatterKey') {

          d3.selectAll(".scatter > circle." + d3.select(this).selectAll('rect').attr('class') + "") // get the current class
            .style("display", "none");

          d3.select(this).attr("class", "deactivated");
        }

        else if (d3.select(this).attr('class') === 'deactivated') {
          d3.selectAll(".scatter > circle." + d3.select(this).selectAll('rect').attr('class') + "") // get the current class
            .style("display", "unset");

        d3.select(this).attr("class", "scatterKey");
      }
      });

  // ------------------------------------------
  // This section draws the overall average scores on the Average Scores chart
  // ------------------------------------------

      // Select the .average SVG
      svgAverage = d3.select('.average');

      // Draw circles for overall average scores
      svgAverage
        .selectAll("circle")
        .data(nestedOverallData)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("class", "average-overall-circle")
        .attr("cy", function (d) {return yScale(d.averageScore)})
        .attr("cx", function(d) {return xScale(d.key)});

      //Draw line
      var line = d3.svg.line()
        .x(function(d) {
          return xScale(d.key);
        })
        .y(function(d) {
          return yScale(d.averageScore);
        })

      var path =  d3.select("svg.average")
        .data(nestedOverallData)
        .append("path")
        .attr("class", "overall-line")
        .attr("d", line(nestedOverallData));

  // ------------------------------------------
  // This section draws the per subject average score chart
  // ------------------------------------------

      // Use the top-level selection to create groups
      svgAverage.selectAll('.subject-group')
      .data(nestedSubjectData)
      .enter().append('g')
      .attr('class', 'subject-group')
      // set the subject as the class
      .attr("id", function(d) {return d.key;})
      .selectAll('circle')
      .data(function(d) {return d.values;})
      .enter()
      // Draw circles for each day
      .append('circle')
      .attr('cx', function(d) {return xScale(d.key);})
      .attr('cy', function(d) { return yScale(d.values.averageScore); })
      .attr('r', 4);

      //Draw line
      var subjectLine = d3.svg.line()
      .interpolate("linear")
      .x(function(d) {
      return xScale(d.key);})
      .y(function(d) {
      return yScale(d.values.averageScore);
      })

      var subjectPath = d3.selectAll(".subject-group")
      .data(nestedSubjectData)
      .append('path')
      .attr('class', 'subject-line')
      .attr("d", subjectLine)
      .attr("d",function(d) {return subjectLine(d.values);})

      // Tooltips for average scores per subject

      var averageSubjectTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "" + formatMean(d.values.averageScore) + "%";
      })

      d3.selectAll(".subject-group > circle").call(averageSubjectTip);
      d3.selectAll(".subject-group > circle").on('mouseover', averageSubjectTip.show).on('mouseout', averageSubjectTip.hide);

      var averageTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "" + formatMean(d.averageScore) + "%";
      })

      d3.selectAll("svg.average > circle").call(averageTip);
      d3.selectAll("svg.average > circle").on('mouseover', averageTip.show).on('mouseout', averageTip.hide);

      // Average scores legend/controls for switching subjects on and off
      d3.select("svg.average-legend")
      .append("g")
      .attr("id", "key")
      .attr("transform", "translate(75, 3)")
      .selectAll("g")
      .data(nestedSubjectData)
      .enter()
      .append("g")
      .attr("class", "averageKey")
      .attr("transform", function(d,i){
          return "translate(" + (i * 63) + ",0)"});

      averageKey = d3.selectAll("g.averageKey");

      averageKey
        .append("rect")
        .attr("class", function(d){return d.key;})
        .attr("width", 58)
        .attr("height", 24)
        .attr("rx", 5)
        .attr("ry", 5);

      averageKey
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", 16)
        .attr("x", 29)
        .text(function(d){return d.key;});

      d3.select('svg.average-legend')
        .append('g')
        .attr("class", "overallKey");

      overallKey =  d3.select('.overallKey');

      overallKey
        .append("rect")
        .attr("width", 58)
        .attr("height", 24)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("transform", "translate(11, 3)");

    overallKey
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", 16)
        .attr("x", 29)
        .text('Overall')
        .attr("transform", "translate(10, 3)");

    averageKey
      .on("click", function() {

        if (d3.select(this).attr('class') === 'averageKey') {

          d3.selectAll(".average > g#" + d3.select(this).selectAll('rect').attr('class') + ".subject-group") // get the class of the clicked button and apply as ID of subject-group
            .style("display", "none");

          d3.select(this).attr("class", "deactivated");
        }

        else if (d3.select(this).attr('class') === 'deactivated') {
          d3.selectAll(".average > g#" + d3.select(this).selectAll('rect').attr('class') + ".subject-group") // get the current class
            .style("display", "unset");

        d3.select(this).attr("class", "averageKey");
      }
      });

      overallKey
        .on("click", function() {

          if (d3.select(this).attr('class') === 'overallKey') {

            d3.selectAll("circle.average-overall-circle") // get the class of the clicked button and apply as ID of subject-group
              .style("display", "none");

            d3.selectAll("path.overall-line") // get the class of the clicked button and apply as ID of subject-group
                .style("display", "none");

            d3.select(this).attr("class", "deactivated");
          }

          else if (d3.select(this).attr('class') === 'deactivated') {

            d3.selectAll("circle.average-overall-circle") // get the class of the clicked button and apply as ID of subject-group
              .style("display", "unset");

            d3.selectAll("path.overall-line") // get the class of the clicked button and apply as ID of subject-group
                .style("display", "unset");

          d3.select(this).attr("class", "overallKey");
        }
        });

// ------------------------------------------
// This section draws the snapshot data for average score, worksheets completed and retries
// ------------------------------------------

    // Number of worksheets completed snapshot

    svgTotalWorkG = d3.select(".total-work")
      .append("g");

      d3.select(".total-work > g")
        .append("circle")
        .attr("class", "total-snapshot")
        .attr("r", 90)
        .attr("transform", "translate(" + circleXtranslate + ", 105)");

      d3.select(".total-work > g")
        .append("text")
        .attr("class", "snapshot-main")
        .attr("transform", "translate(" + circleXtranslate + ", 140)")
        .attr("text-anchor", "middle")
        .text(function(d) {return periodData.length;});

     d3.select(".total-work > g")
        .append("text")
        .attr("class", function(){
          if (dataToCompare.length - periodData.length < 0) {
              return "better"
          } else if (dataToCompare.length - periodData.length > 0) {
              return "worse"
          } else {
              return "no-change"
          }
        })
        .attr("transform", "translate(" + circleXtranslate + ", 235)")
        .attr("text-anchor", "middle")
        .text(function(){
          if (dataToCompare.length - periodData.length < 0) {
              return  "" + Math.abs((periodData.length - dataToCompare.length)) + " more than last " + periodReadable() + "";
          } else if (dataToCompare.length - periodData.length > 0) {
              return  "" + Math.abs((periodData.length - dataToCompare.length)) + " less than last " + periodReadable() + "";
          } else {
                return "No change from last "+ periodReadable() + "";
          }
        });

      // Average score snapshot

      svgAverageScoreG = d3.select(".average-score")
        .append("g");

      d3.select(".average-score > g")
        .append("circle")
        .attr("r", 90)
        .attr("class", "average-snapshot")
        .attr("transform", "translate(" + circleXtranslate + ", 105)");

      periodAverageScore = d3.mean(periodData, function(d) {
          return d.Percentage;}
        );

      var comparePeriodAverageScore = d3.mean(dataToCompare, function(d) {
        return d.Percentage;}
      );

      var averageScorePercentageChange = formatMean(((periodAverageScore - comparePeriodAverageScore) / periodAverageScore) * 100);

      d3.select(".average-score > g")
        .data(periodData)
        .append("text")
        .attr("class", "snapshot-main")
        .attr("id", "average-score-period")
        .attr("transform", "translate(" + circleXtranslate + ", 140)")
        .attr("text-anchor", "middle")
        .text(formatMean(periodAverageScore));

      d3.select(".average-score > g")
        .data(dataToCompare)
        .append("text")
        .attr("class", function(){
          if (averageScorePercentageChange > 0) {
            return "better"
        } else if (averageScorePercentageChange < 0) {
            return "worse"
        } else {
            return "no-change"
        }
        })
        .attr("transform", "translate(" + circleXtranslate + ", 235)")
        .attr("text-anchor", "middle")
        .text(function(){
          if (averageScorePercentageChange > 0) {
              return  "" + averageScorePercentageChange + "% up from last " + periodReadable() + ""
          } else if (averageScorePercentageChange < 0) {
              return  "" + Math.abs(averageScorePercentageChange) + "% down from last " + periodReadable() + ""
          } else {
                return "No change from last "+ periodReadable() + "";
          }
          });

      // Retries snapshot

      var  retriesDataToNest = periodData;
      retriesData = d3.nest()
        .key(function(el) {return el.worksheetId})
        .entries(retriesDataToNest);

      var  retriesComparisonDataToNest = dataToCompare;
      retriesComparison = d3.nest()
        .key(function(el) {return el.worksheetId})
        .entries(retriesComparisonDataToNest);


      svgRetriesG = d3.select(".retries")
        .append("g");

      d3.select(".retries > g")
        .append("circle")
        .attr("class", "retries-snapshot")
        .attr("r", 90)
        .attr("transform", "translate(" + circleXtranslate + ", 105)");

      var retriesThisWeek = periodData.length - retriesData.length;
      var retriesLastWeek = dataToCompare.length - retriesComparison.length;
      var retriesChange = retriesThisWeek - retriesLastWeek;

      d3.select(".retries > g")
        .append("text")
        .attr("class", "snapshot-main")
        .attr("transform", "translate(" + circleXtranslate + ", 140)")
        .attr("text-anchor", "middle")
        .text(function(d) {return retriesThisWeek;});

      d3.select(".retries > g")
        .append("text")
        .attr("class", function(){
          if (retriesChange < 0) {
              return "better"
          } else if (retriesChange > 0) { // Positive numer displays as red because a larger number of retries in this period is worse
              return "worse"
          } else {
              return "no-change"
          }
        })
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + circleXtranslate + ", 235)")
        .text(function(){
          if (retriesChange > 0) {
              return  "" + retriesChange + " more than last " + periodReadable() + "";
          } else if (retriesChange < 0) {
              return  "" + Math.abs(retriesChange) + " less than last " + periodReadable() + "";
          } else {
              return "No change from last "+ periodReadable() + "";
          }
        });





// ------------------------------------------
// This section draws the rewards snapshot and plots the rewards on the Overview chart
// ------------------------------------------

d3.json("php/student-rewards.php", function(rewardData) {renderRewards(rewardData);});

  function renderRewards(rewardData) {

    rewardData.results.forEach(function(d) {
    d.dateCreated = formatDate(d.dateCreated);
    });

   rewardData.results.forEach(function(d) {
    if (d.date_collected != null) {
    d.date_collected = formatDate(d.date_collected)};
    });

    rewardsCreated = rewardData.results.filter(function (d) {
      return d.dateCreated > cutoffDate ;
    });
    rewardsCollected = rewardData.results.filter(function (d) {
      return d.date_collected > cutoffDate ;
    });

    previousPeriodRewardsCreated = rewardData.results.filter(function (d) {
      return d.dateCreated > compareDate && d.dateCreated < cutoffDate;
    });

    previousPeriodRewardsCollected = rewardData.results.filter(function (d) {
      return d.date_collected > compareDate && d.date_collected < cutoffDate;
    });

    rewardsCreatedChange = rewardsCreated.length - previousPeriodRewardsCreated.length;
    rewardsCollectedChange = rewardsCollected.length - previousPeriodRewardsCollected.length;

    // Nest and sort collected rewards

   nestedRewardsCreated = d3.nest()
         .key(function(el) {return el.dateCreated})
         .entries(rewardsCreated);

    nestedRewardsCreated.forEach(function (el) {
          el.totalRewardsCreated = el.values.length;
          el.key = new Date(el.key);
     });

     nestedRewardsCreated.sort(function (a,b) {
       return a.key - b.key;
     });

    // Nest and sort collected rewards

    nestedRewardsCollected = d3.nest()
         .key(function(el) {return el.date_collected})
         .entries(rewardsCollected);

    nestedRewardsCollected.forEach(function (el) {
          el.totalRewardsCollected = el.values.length;
          el.key = new Date(el.key);
     });

     nestedRewardsCollected.sort(function (a,b) {
       return a.key - b.key;
     });

    // Snapshot for rewards collected

    svgRewardsG = d3.select(".rewards-collected")
      .append("g");

    d3.select(".rewards-collected > g")
      .insert("image")
      .attr("xlink:href", "img/reward-collected.svg")
      .attr("width", "205")
      .attr("height", "205")
      .attr("transform", "translate(22.5, -5)");

      d3.select(".rewards-collected > g")
        .append("text")
        .attr("class", "snapshot-rewards")
        .attr("transform", "translate(120, 85)")
        .attr("text-anchor", "middle")
        .text(function(d) {return rewardsCollected.length;});

      d3.select(".rewards-collected > g")
        .append("text")
        .attr("class", function(){
          if (rewardsCollectedChange > 0) {
              return "better"
          } else if (rewardsCollectedChange < 0) { // Positive numer displays as red because a larger number of retries in this period is worse
              return "worse"
          } else {
              return "no-change"
          }
          })
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + circleXtranslate + ", 235)")
        .text(function(){
          if (rewardsCollectedChange < 0) {
              return  "" + Math.abs(rewardsCollectedChange) + " less than last " + periodReadable() + "";
          } else if (rewardsCollectedChange > 0) {
              return  "" + rewardsCollectedChange + " more than last " + periodReadable() + "";
          } else {
              return "No change from last "+ periodReadable() + "";
          }
          });

      // Snapshot for Rewards Created

      svgRewardsCreatedG = d3.select(".rewards-created")
        .append("g");

      d3.select(".rewards-created > g")
        .insert("image")
        .attr("xlink:href", "img/reward-created.svg")
        .attr("width", "205")
        .attr("height", "205")
        .attr("transform", "translate(22.5, -5)");

      d3.select(".rewards-created > g")
        .append("text")
        .attr("class", "snapshot-rewards")
        .attr("transform", "translate(120, 85)")
        .attr("text-anchor", "middle")
        .text(function(d) {return rewardsCreated.length;});

      d3.select(".rewards-created > g")
        .append("text")
        .attr("class", function(){
          if (rewardsCreatedChange > 0) {
              return "better"
          } else if (rewardsCreatedChange < 0) { // Positive numer displays as red because a larger number of retries in this period is worse
              return "worse"
          } else {
              return "no-change"
          }
        })
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + circleXtranslate + ", 235)")
        .text(function(){
          if (rewardsCreatedChange < 0) {
              return  "" + Math.abs(rewardsCreatedChange) + " less than last " + periodReadable() + "";
          } else if (rewardsCreatedChange > 0) {
              return  "" + rewardsCreatedChange + " more than last " + periodReadable() + "";
          } else {
              return "No change from last "+ periodReadable() + "";
          }
        });

      // Plot rewards COLLECTED on overview

      d3.select("svg.overall")
      .selectAll("circle.reward-collected")
      .data(nestedRewardsCollected)
      .enter()
      .append("circle")
      .attr("class", "reward-collected")
      .attr("r", 4)
      .attr("cy", function (d) {return yScaleOverall(d.totalRewardsCollected)})
      .attr("cx", function(d) {return xScale(d.key)});

      //Draw line
      var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
          return xScale(d.key);
        })
        .y(function(d) {
          return yScaleOverall(d.totalRewardsCollected);
        })

      var path =  d3.select("svg.overall")
        .data(nestedRewardsCollected)
        .append("path")
        .attr("class", "reward-collected-line")
        .attr("d", line(nestedRewardsCollected));

      // Plot rewards COLLECTED on overview

      //Draw line
      var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) {
          return xScale(d.key);
        })
        .y(function(d) {
          return yScaleOverall(d.totalRewardsCreated);
        })
      var path =  d3.select("svg.overall")
        .data(nestedRewardsCreated)
        .append("path")
        .attr("class", "reward-created-line")
        .attr("stroke-dasharray", "3, 3")
        .attr("d", line(nestedRewardsCreated));

      d3.select("svg.overall")
      .selectAll("circle.reward-created")
      .data(nestedRewardsCreated)
      .enter()
      .append("circle")
      .attr("class", "reward-created")
      .attr("r", 4)
      .attr("cy", function (d) {return yScaleOverall(d.totalRewardsCreated)})
      .attr("cx", function(d) {return xScale(d.key)});



        // Rewards tooltips

        var rewardCollectedTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
        return d.totalRewardsCollected + " rewards collected";
        })

       d3.selectAll("svg.overall > circle.reward-collected").call(rewardCollectedTip);
       d3.selectAll("svg.overall > circle.reward-collected").on('mouseover', rewardCollectedTip.show).on('mouseout', rewardCollectedTip.hide);

       var rewardCreatedTip = d3.tip()
       .attr('class', 'd3-tip')
       .offset([-10, 0])
       .html(function(d) {
       return d.totalRewardsCreated +" rewards created";
       })

      d3.selectAll("svg.overall > circle.reward-created").call(rewardCreatedTip);
      d3.selectAll("svg.overall > circle.reward-created").on('mouseover', rewardCreatedTip.show).on('mouseout', rewardCreatedTip.hide);


    }; // End of renderRewards function

  // ------------------------------------------
  // This section draws parent login data snapshot and plots on the overview chart
  // ------------------------------------------

 d3.json("php/parent-logins.php", function(d2) {
    renderParentLogins(d2);
  });

  function renderParentLogins(d2) {

    d2.results.forEach(function(d) {
    d.loginDate = formatDate(d.loginDate);
    });

    // Filter out data for period
    periodParentLogins = d2.results.filter(function (d) {
      return d.loginDate > cutoffDate; // Should be able to replace this with a d3 date interval
    });


    // Filter for previous period
    previousPeriodParentLogins = d2.results.filter(function (d) {
      return d.loginDate > compareDate && d.loginDate < cutoffDate;
    });

    parentLoginChange = periodParentLogins.length - previousPeriodParentLogins.length;

    svgParentLogins = d3.select(".logins")
      .append("g");

      d3.select(".logins > g")
      .insert("image")
      .attr("width", "90")
      .attr("height", "90")
      .attr("transform", "translate(0, 10)")
      .attr("xlink:href", "img/avatar.svg");

      d3.select(".logins > g")
      .append("text")
      .attr("class", "logins-text")
      .attr("transform", "translate(90, 90)")
      .text(periodParentLogins.length);

     d3.select(".logins > g")
      .append("text")
      .attr("class", "logins-sub-text")
      .attr("transform", "translate(45, 115)")
      .attr("text-anchor", "middle")
      .text("Parent");

      d3.select(".logins > g")
        .append("path")
        .attr("d", d3.svg.symbol().type(function() {
          if(parentLoginChange > 0) {return 'triangle-up';}
          else if (parentLoginChange < 0) {return 'triangle-down';}
          else {return 'square'};
        }).size(['400']))
        .attr("class",  function() {
          if (parentLoginChange > 0) {
              return "better"
          } else if (parentLoginChange < 0) {
              return "worse"
          } else {
              return "no-login-change"
          }
        })
        .attr("transform", "translate(235, 50)");

      d3.select(".logins > g")
        .append("text")
        .attr("class",  function() {
          if (parentLoginChange > 0) {
              return "better"
          } else if (parentLoginChange < 0) {
              return "worse"
          } else {
              return "no-change"
          }
        })
        .text(function(){
          if (parentLoginChange > 0) {
              return "+" + parentLoginChange + "";
          } else if (parentLoginChange < 0) {
              return parentLoginChange;
          }
        })
        .attr("transform", "translate(234, 82)")
        .attr("text-anchor", "middle");

        // Nest and draw parent logins by day on overview chart

        var parentLoginstoNest = periodParentLogins;
           nestedParentLogins = d3.nest()
             .key(function(el) {return el.loginDate})
             .entries(parentLoginstoNest);

        nestedParentLogins.forEach(function (el) {
           el.totalLogins = el.values.length;
           el.key = new Date(el.key);
         });

         // Sorts nested array by date
         nestedParentLogins.sort(function (a,b) {
           return a.key - b.key;
         });

         //Draw line on overview
         var line = d3.svg.line()
           .x(function(d) {
             return xScale(d.key);
           })
           .y(function(d) {
             return yScaleOverall(d.totalLogins);
           })

         var path =  d3.select("svg.overall")
           .data(nestedParentLogins)
           .append("path")
           .attr("class", "parent-login-line")
            .style("stroke-dasharray", "3, 3")
           .attr("d", line(nestedParentLogins));

        // Draw circles overview data

         d3.select("svg.overall")
         .selectAll("circle.parent-login")
         .data(nestedParentLogins)
         .enter()
         .append("circle")
         .attr("class","parent-login")
         .attr("r", 4)
         .attr("cy", function (d) {return yScaleOverall(d.totalLogins)})
         .attr("cx", function(d) {return xScale(d.key)});

        // Add tooltips for Overview

        var parentLoginTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
        return d.totalLogins + " parent logins";
        })

       d3.selectAll("svg.overall > circle.parent-login").call(parentLoginTip);
       d3.selectAll("svg.overall > circle.parent-login").on('mouseover', parentLoginTip.show).on('mouseout', parentLoginTip.hide);


     }; // End of render parent Logins

  // ------------------------------------------
  // This section draws the student login and snapshot and plots on the overview chart
  // ------------------------------------------

    d3.json("php/student-logins.php", function(studentLoginData) {
      renderStudentLogins(studentLoginData);
    });

    function renderStudentLogins(studentLoginData) {

          studentLoginData.results.forEach(function(d) {
          d.loginDate = formatDate(d.loginDate);

          });

          // Filter out data for period
          periodStudentLogins = studentLoginData.results.filter(function (d) {
            return d.loginDate > cutoffDate; // Should be able to replace this with a d3 date interval
          });

          // Filter for previous period
          previousPeriodStudentLogins = studentLoginData.results.filter(function (d) {
            return d.loginDate > compareDate && d.loginDate < cutoffDate;
          });

          loginChange = periodStudentLogins.length - previousPeriodStudentLogins.length;
          d3.select(".logins")
            .append("g")
            .attr("class", "studentlogin")

          d3.select(".logins > g.studentlogin")
          .append("text")
          .attr("class", "logins-text")
          .attr("transform", "translate(90, 220)")
          .text(periodStudentLogins.length);

          d3.select(".logins > g.studentlogin")
          .insert("image")
          .attr("width", "70")
          .attr("height", "70")
          .attr("transform", "translate(10, 150)")
          .attr("xlink:href", "img/avatar.svg");

          d3.select(".logins > g.studentlogin")
           .append("text")
           .attr("class", "logins-sub-text")
           .attr("transform", "translate(45, 235)")
           .attr("text-anchor", "middle")
           .text("Student");

          d3.select(".logins > g.studentlogin")
            .append("path")
            .attr("d", d3.svg.symbol().type(function() {
              if(loginChange > 0) {return 'triangle-up';}
              else if (loginChange < 0) {return 'triangle-down';}
              else {return 'square'};
            }).size(['400']))
            .attr("class",  function() {
              if (loginChange > 0) {
                  return "better"
              } else if (loginChange < 0) {
                  return "worse"
              } else {
                  return "no-login-change"
              }
            })
            .attr("transform", "translate(235, 180)");

          d3.select(".logins > g.studentlogin")
            .append("text")
            .attr("class",  function() {
              if (loginChange > 0) {
                  return "better"
              } else if (loginChange < 0) {
                  return "worse"
              } else {
                  return "no-change"
              }
            })
            .text(function(){
              if (loginChange > 0) {
                  return "+" + loginChange + "";
              } else if (loginChange < 0) {
                  return loginChange;
              }
            })
            .attr("transform", "translate(234, 212)")
            .attr("text-anchor", "middle");

        // Draw student logins on overiew chart

          var studentLoginstoNest = periodStudentLogins;
          nestedStudentLogins = d3.nest()
           .key(function(el) {return el.loginDate})
           .entries(studentLoginstoNest);

          nestedStudentLogins.forEach(function (el) {
               el.totalLogins = el.values.length;
               el.key = new Date(el.key);
             });

          // Sorts nested array by date
          nestedStudentLogins.sort(function (a,b) {
           return a.key - b.key;
          });

        // Draw dots and lines on overview data

         d3.select("svg.overall")
         .selectAll("circle.student-login")
         .data(nestedStudentLogins)
         .enter()
         .append("circle")
         .attr("class","student-login")
         .attr("r", 4)
         .attr("cy", function (d) {return yScaleOverall(d.totalLogins)})
         .attr("cx", function(d) {return xScale(d.key)});

         //Draw line
         var line = d3.svg.line()
           .x(function(d) {
             return xScale(d.key);
           })
           .y(function(d) {
             return yScaleOverall(d.totalLogins);
           })

         var pathStudent =  d3.select("svg.overall")
           .data(nestedStudentLogins)
           .append("path")
           .attr("class", "student-login-line")
           .attr("d", line(nestedStudentLogins));

          // Tooltips for student logins
          var studentLoginTip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
          return d.totalLogins + " student logins";
          })

          d3.selectAll("svg.overall > circle.student-login").call(studentLoginTip);
          d3.selectAll("svg.overall > circle.student-login").on('mouseover', studentLoginTip.show).on('mouseout', studentLoginTip.hide);


      }; // End of render student Logins


    d3.json("php/student-badges.php", function(badgesData) {renderBadges(badgesData);});

      function renderBadges(badgesData) {

        badgesData.results.forEach(function(d) {
        d.dateUnlocked = formatDate(d.dateUnlocked);
        });

        // Filter out data for period
        badgesPeriodData = badgesData.results.filter(function (d) {
          return d.dateUnlocked > cutoffDate; // Should be able to replace this with a d3 date interval
        });

      // Filter for previous period
      badgesPreviousPeriod = badgesData.results.filter(function (d) {
        return d.dateUnlocked > compareDate && d.dateUnlocked < cutoffDate;
      });


      svgBadgesG = d3.select(".badges-unlocked")
        .append("g");

        d3.select(".badges-unlocked > g")
          .insert("image")
          .attr("xlink:href", "img/badge.svg")
          .attr("width", "180")
          .attr("height", "180")
          .attr("transform", "translate(40, 10)");

          var badgesThisPeriod = badgesPeriodData.length;
          var badgesLastPeriod = badgesPreviousPeriod.length;
          var badgesChange = badgesThisPeriod - badgesLastPeriod;

        d3.select(".badges-unlocked > g")
          .append("text")
          .attr("class", "snapshot-main")
          .attr("transform", "translate(130, 135)")
          .attr("text-anchor", "middle")
          .text(function(d) {return badgesThisPeriod;});

        d3.select(".badges-unlocked > g")
          .append("text")
          .attr("class", function(){
            if (badgesChange < 0) {
                return "worse"
            } else if (badgesChange > 0) { // Positive numer displays as red because a larger number of retries in this period is worse
                return "better"
            } else {
                return "no-change"
            }
          })
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + circleXtranslate + ", 235)")
          .text(function(){
            if (badgesChange > 0) {
                return  "" + badgesChange + " more than last " + periodReadable() + "";
            } else if (badgesChange < 0) {
                return  "" + Math.abs(badgesChange) + " less than last " + periodReadable() + "";
            } else {
                return "No change from last "+ periodReadable() + "";
            }
          });

    }; // End of badges function


		// Get EdPlace average score for period - file name changes based on selected timeframe
    d3.json('php/average-score-' + period + '.php', function(edAverageScore) {renderEdplaceAverage(edAverageScore)});


    function renderEdplaceAverage(edAverageScore) {
      edAverageScoreData = edAverageScore.results[0].Percentage;

      d3.select('.edplace-average')
          .append('g');

      d3.select(".edplace-average > g")
          .append("circle")
          .attr("class", "edplace-snapshot")
          .attr("r", 90)
          .attr("transform", "translate(" + circleXtranslate + ", 105)");

      d3.select(".edplace-average > g")
        .append("text")
        .attr("class", "snapshot-main")
        .attr("transform", "translate(" + circleXtranslate + ", 140)")
        .attr("text-anchor", "middle")
        .text(edAverageScoreData);


    }; // End of EdPlace average score


    // Create legend/key for overview visualisation - these are at the end to make sure that everything has been draw before these are applied

        d3.select('svg.overview-legend')
          .append('g')
          .attr("class", "worksheetsKey");

        worksheetsKey =  d3.select('.worksheetsKey');

        worksheetsKey
          .append("rect")
          .attr("width", 80)
          .attr("height", 24)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("transform", "translate(12, 3)");

       worksheetsKey
          .append("text")
          .style("text-anchor", "middle")
          .attr("y", 16)
          .attr("x", 29)
          .text('Worksheets')
          .attr("transform", "translate(23, 3)");

        d3.select('svg.overview-legend')
          .append('g')
          .attr("class", "loginsKey");

        loginsKey =  d3.select('.loginsKey');

        loginsKey
            .append("rect")
            .attr("width", 80)
            .attr("height", 24)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("transform", "translate(96, 3)");

        loginsKey
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 16)
            .attr("x", 29)
            .text('Logins')
            .attr("transform", "translate(106, 3)");

        d3.select('svg.overview-legend')
          .append('g')
          .attr("class", "rewardsKey");

        rewardsKey =  d3.select('.rewardsKey');

        rewardsKey
            .append("rect")
            .attr("width", 80)
            .attr("height", 24)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("transform", "translate(180, 3)");

        rewardsKey
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 16)
            .attr("x", 29)
            .text('Rewards')
            .attr("transform", "translate(191, 3)");

        rewardsKey
          .on("click", function() {

            if (d3.select(this).attr('class') === 'rewardsKey') {

              d3.selectAll("circle.reward-created")
                .style("display", "none");

              d3.selectAll("path.reward-created-line")
                  .style("display", "none");

              d3.selectAll("circle.reward-collected")
                .style("display", "none");

              d3.selectAll("path.reward-collected-line")
                  .style("display", "none");

              d3.select(this).attr("class", "deactivated");
            }

            else if (d3.select(this).attr('class') === 'deactivated') {

              d3.selectAll("circle.reward-created")
                .style("display", "unset");

              d3.selectAll("path.reward-created-line")
                  .style("display", "unset");

              d3.selectAll("circle.reward-collected")
                .style("display", "unset");

              d3.selectAll("path.reward-collected-line")
                  .style("display", "unset");

            d3.select(this).attr("class", "rewardsKey");
          }
          });

          loginsKey
            .on("click", function() {

              if (d3.select(this).attr('class') === 'loginsKey') {

                d3.selectAll("circle.student-login")
                  .style("display", "none");

                d3.selectAll("path.student-login-line")
                    .style("display", "none");

                d3.selectAll("circle.parent-login")
                  .style("display", "none");

                d3.selectAll("path.parent-login-line")
                    .style("display", "none");

                d3.select(this).attr("class", "deactivated");
              }

              else if (d3.select(this).attr('class') === 'deactivated') {

                d3.selectAll("circle.student-login")
                  .style("display", "unset");

                d3.selectAll("path.student-login-line")
                    .style("display", "unset");

                d3.selectAll("circle.parent-login")
                  .style("display", "unset");

                d3.selectAll("path.parent-login-line")
                    .style("display", "unset");

              d3.select(this).attr("class", "loginsKey");
            }
            });

            worksheetsKey
              .on("click", function() {

                if (d3.select(this).attr('class') === 'worksheetsKey') {

                  d3.selectAll("circle.overview-circle")
                    .style("display", "none");

                  d3.selectAll("path.overview-line")
                      .style("display", "none");

                  d3.select(this).attr("class", "deactivated");
                }

                else if (d3.select(this).attr('class') === 'deactivated') {

                  d3.selectAll("circle.overview-circle")
                    .style("display", "unset");

                  d3.selectAll("path.overview-line")
                      .style("display", "unset");

                d3.select(this).attr("class", "worksheetsKey");
              }
              });

      d3.json("php/student-worksheets.php", function(worksheetData) {
        d3.json("php/parent-logins.php", function(parentLoginData) {
          d3.json("php/student-logins.php", function(studentLoginData) {
                accountHealth(worksheetData, parentLoginData, studentLoginData);
             });
         });
      });

}; // End of render function


      function accountHealth(worksheets, studentLogins, parentLogins) {

        worksheets.results.forEach(function(d) {
          d.dateAppeared = formatDate(d.dateAppeared);
          });

        wsCompletedPeriod = worksheets.results.filter(function (d) {
          return d.dateAppeared > cutoffDate;
        });

        wsHealth = wsCompletedPeriod.length;

        averageHealth = formatMean(d3.mean(wsCompletedPeriod, function(d) {
            return d.Percentage;})
          );

        parentLogins.results.forEach(function(d) {
          d.loginDate = formatDate(d.loginDate);
          });

        // Filter out data for period
        pLoginsPeriod = parentLogins.results.filter(function (d) {
            return d.loginDate > cutoffDate; // Should be able to replace this with a d3 date interval
          });

        pLoginHealth = pLoginsPeriod.length;

        studentLogins.results.forEach(function(d) {
        d.loginDate = formatDate(d.loginDate);
        });

        // Filter out data for period
        sLoginsPeriod = studentLogins.results.filter(function (d) {
          return d.loginDate > cutoffDate; // Should be able to replace this with a d3 date interval
        });

        sLoginHealth = pLoginsPeriod.length;

        periodHealth = function() {
          if(period == 7) {
            weekHealth();
          }
          else if(period == 30) {
            monthHealth();
          }
        };

        function weekHealth() {
        if (sLoginHealth > 0 && pLoginHealth > 0 && averageHealth > 69 && wsHealth > 9) {
          overallHealth = '3';
        }
        else if (sLoginHealth > 0 && averageHealth > 50 && wsHealth > 4) {
          overallHealth = '2'
        }
        else {
          overallHealth = '1'
        }
        renderHealth(overallHealth);
      };

      function monthHealth() {
      if (sLoginHealth > 4 && pLoginHealth > 2 && averageHealth > 69 && wsHealth > 39) {
        overallHealth = '3';
      }
      else if (sLoginHealth > 2 && pLoginHealth > 1 && averageHealth > 50 && wsHealth > 19) {
        overallHealth = '2'
      }
      else {
        overallHealth = '1'
      }
      renderHealth(overallHealth);
      };

      periodHealth();

      function renderHealth(rating) {

          healthG = d3.select(".health")
            .append("g");

          d3.select(".health > g")
            .append("circle")
            .attr("class", function(){
              return "health" + rating + "";
            })
            .attr("r", 72.5)
            .attr("transform", "translate(" + circleXtranslate + ", 105)");

          d3.select(".health > g")
            .append("text")
            .attr("class", function(){
              return "healthsnapshot" + rating + "";
            })
            .attr("transform", "translate(" + circleXtranslate + ", 142)")
            .attr("text-anchor", "middle")
            .text(function(){
              if (rating == 3) {
                  return  "+";
              } else if (rating == 2) {
                  return  "-";
              } else if (rating == 1) {
                  return "!";
              }
            });

          d3.select(".health > g")
            .append("text")
            .attr("class", function(){
              if (rating == 3) {
                  return "green"
              } else if (rating == 2) {
                  return "amber"
              } else if (rating == 1) {
                  return "red"
              }
            })
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + circleXtranslate + ", 235)")
            .text(function(){
              if (rating == 3) {
                  return  "A great " + periodReadable() + "!";
              } else if (rating == 2) {
                  return  "Not a bad " + periodReadable() + ".";
              } else if (rating == 1) {
                  return "Still some work to do";
              }
            });

        };

      }; // End of Account Health function

}; // End of allViz function

// ------------------------------------------
// This section updates the visualisations by removing the existing charts and running the allViz function again
// ------------------------------------------

// Update function removes existing charts

function update() {
    d3.selectAll('div > svg > g')
    .remove();

    d3.selectAll('div > svg > path')
    .remove();

    d3.selectAll('div > svg > circle')
    .remove();
};

// Redraw function funs the allViz function using the new time period

function redraw(newPeriod) {
  allViz(newPeriod);
};
