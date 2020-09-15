<?php
require_once('php/init.php');
?>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Learning Dashboard</title>
    <link rel="stylesheet" href="css/foundation.css" />
    <link rel="stylesheet" href="css/app.css" />
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
    <link href='https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.css' rel='stylesheet' type='text/css'>
    <script src="js/d3.js" type="text/JavaScript"></script>
    <script src="js/d3.tip.js" type="text/JavaScript"></script>
    <script src="viz/init.js" type="text/JavaScript"></script>
    <script src="js/vendor/modernizr.js" type="text/JavaScript"></script>
    <script src="js/vendor/jquery.js" type="text/JavaScript"></script>
    <!-- Start Visual Website Optimizer Asynchronous Code -->
<script type='text/javascript'>
var _vwo_code=(function(){
var account_id=153314,
settings_tolerance=2000,
library_tolerance=2500,
use_existing_jquery=false,
// DO NOT EDIT BELOW THIS LINE
f=false,d=document;return{use_existing_jquery:function(){return use_existing_jquery;},library_tolerance:function(){return library_tolerance;},finish:function(){if(!f){f=true;var a=d.getElementById('_vis_opt_path_hides');if(a)a.parentNode.removeChild(a);}},finished:function(){return f;},load:function(a){var b=d.createElement('script');b.src=a;b.type='text/javascript';b.innerText;b.onerror=function(){_vwo_code.finish();};d.getElementsByTagName('head')[0].appendChild(b);},init:function(){settings_timer=setTimeout('_vwo_code.finish()',settings_tolerance);var a=d.createElement('style'),b='body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}',h=d.getElementsByTagName('head')[0];a.setAttribute('id','_vis_opt_path_hides');a.setAttribute('type','text/css');if(a.styleSheet)a.styleSheet.cssText=b;else a.appendChild(d.createTextNode(b));h.appendChild(a);this.load('//dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&r='+Math.random());return settings_timer;}};}());_vwo_settings_timer=_vwo_code.init();
</script>
<!-- End Visual Website Optimizer Asynchronous Code -->
  </head>

  <body> <!-- onload="initialise(7)">-->
    <nav class="top-bar" data-topbar role="navigation">
      <ul class="title-area">
        <li class="name"></li>
      </ul>

      <section class="top-bar-section">
      <ul class="left">
        <li><a href="#"><i class="fi-home"></i> Home</a></li>
        <li><a class="current-info">
        <span id='username'>
          <?php getUserName() ?>&#39;s
        </span> learning progress in the last
        <span class='period'></span></a></li>
      </ul>
      </section>
      <section class="top-bar-section">
          <ul class="right">
            <li class="divider"></li>
            <li class="has-dropdown">
              <a href="#"><i class="fi-torsos-female-male"></i> Select student</a>
              <ul class="dropdown">
                <?php
                //echo '<pre>'; print_r($students); echo'</pre>';
                foreach ($students as $row) {
                  echo '<li><a href="#" class="select-student" id="' .  $row['id'] . '">' . $row['fname'] . $row['lname'] . '</a></li>';
                };
                ?>
              </ul>
            </li>
            <li class="divider"></li>
            <li class="has-dropdown">
       <a href="#"><i class="fi-calendar"></i> Select time period</a>
       <ul class="dropdown">
          <li><a href="#"  id="7days">Last 7 days</a></li>
          <li><a href="#"  id="30days">Last 30 days</a></li>
        </ul>
     </li>
            <li class="divider"></li>
            <li class="has-form">
              <a href="#" class="button">Send feedback</a>
          </li>
        </ul>
      </section>
    </nav>

    <section roles="main">
      <div class="row">
        <div  class="large-6 columns" >
          <div class="card" id="overall-vis" >
            <div class="row">
              <div class="large-6 columns">
                <h5>Overview  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of worksheets completed, logins by you and the selected student plus rewards completed and set by day for the selected period."><i class="fi-info"></i></span></h5>
              </div>
              <div class="large-6 columns">
                <svg class="overview-legend" height="40" width="260"></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="large-3 columns" >
          <div class="card"   id="average-score-vis">
          <h5>Average score (%)  <span data-tooltip aria-haspopup="true" class="has-tip" title="The average score for all worksheets completed in the selected time period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
        <div class="large-3 columns" >
          <div class="card" id="health-vis">
            <h5>Account health <span data-tooltip aria-haspopup="true" class="has-tip" title="We look at worksheet completions, average scores and logins to calculate your account health. Good account health means you're getting the best from EdPlace!"><i class="fi-info"></i></span></h5>
          </div>
        </div>
      </div>

      <div class="row">
        <div  class="large-6 columns">
          <div class="card" id="scatter-vis" >
            <div class="row">
              <div class="large-6 columns">
              <h5>Worksheets <span data-tooltip aria-haspopup="true" class="has-tip" title="All worksheets completed in the selected time period."><i class="fi-info"></i></span></h5>
              </div>
              <div class="large-6 columns">
                <svg class="worksheet-legend" height="40" width="260"></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="total-complete-vis">
          <h5>Total completed  <span data-tooltip aria-haspopup="true" class="has-tip" title="The total number of worksheets completed in the selected time period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="retries-vis">
          <h5>Retries <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of worksheets that the student has completed more than once. Lots of retries might mean they're struggling with a worksheet or topic."><i class="fi-info"></i></span></h5>
        </div>
        </div>
      </div>

      <div class="row">
        <div  class="large-6 columns">
          <div class="card" id="average-vis" >
            <div class="row">
              <div class="large-6 columns">
                <h5>Average scores  <span data-tooltip aria-haspopup="true" class="has-tip" title="The average score in each subject and overall for each day in the selected time period."><i class="fi-info"></i></span></h5>
              </div>
              <div class="large-6 columns">
                <svg class="average-legend" height="40" width="260"></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="logins-vis">
          <h5>Logins  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of times you and the selected student logged in over the selected time period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="badges-vis">
          <h5>Badges  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of badges the student unlocked in the selected period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
      </div>
    </div>

      <div class="row">

        <div class="large-3 columns">
          <div class="card" id="rewards-collected-vis">
          <h5>Rewards acheived  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of rewards collected in the selected time period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
        <div class="large-3 columns end">
          <div class="card" id="rewards-created-vis">
          <h5>Rewards created  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of rewards you created in the selected time period. Rewards can help motivate students to complete more worksheets."><i class="fi-info"></i></span></h5>
        </div>
      </div>
      </div>

  </section>
    <script src="viz/all-viz-functional.js" type="text/JavaScript"></script>
    <script src="js/vendor/fastclick.js"></script>
    <script src="js/foundation.min.js"></script>
    <script src="js/foundation/foundation.topbar.js"></script>
    <script>
$(document).ready(function() {
  initialise(7);
});

$(document).foundation();

$("a#7days").click(function(event){
    event.preventDefault();
    update();
    redraw(7);

});

$("a#30days").click(function(event){
    event.preventDefault();
    update();
    redraw(30);
});

$(".select-student").click(function(event){
var student_id = event.target.id;

$.ajax({ url: 'php/update-student.php',
         data: {id: student_id},
         type: 'post',
         success: function(data) {
                      update();
                      redraw(7);
                      $('#username').html('' + data + '&#39;s');
                  }
});
});

  </script>

  <script>
  // GA tracking
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-21138955-4', 'auto');
  ga('send', 'pageview');

</script>
  </body>
</html>
