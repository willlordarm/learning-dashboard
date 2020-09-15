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
  </head>

  <body>
    <div data-alert class="alert-box alert show-for-small-only">
  Unfortunately the learning dashboard isn't mobile-optimised yet. Please try it out on a larger screen.
  <a href="#" class="close">&times;</a>
</div>
    <nav class="top-bar" data-topbar role="navigation">
      <ul class="title-area">
        <li class="name"></li>
      </ul>

      <section class="top-bar-section">
      <ul class="left">
        <li><a href="#" data-reveal-id="exitmessage"><i class="fi-home"></i> Home</a></li>
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
                $groups = array();
                foreach ($students as $student) {
                      $key = $student['student_year'];
                      if (!isset($groups[$key])) {
                          $groups[$key] = array(
                              'students' => array($student)
                          );
                     }
                else {
                       $groups[$key]['students'][] = $student;
                     }
                  };

                      foreach($groups as $key => $group) {

                        echo '<li class="has-dropdown"><a href="#">Year ' . $key . '</a><ul class="dropdown">';
                        foreach($group['students'] as $student) {

                          echo '<li><a href="#" class="select-student" id="' .  $student['id'] . '">' . $student['fname'] . ' ' . $student['lname'] . '</a></li>';
                        };

                        echo '</ul></li>';

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
              <a href="https://edplace.typeform.com/to/IbejKW" target="_blank" class="button">Send feedback</a>
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
          <div class="card" id="health-vis">
              <h5>Account health <span data-tooltip aria-haspopup="true" class="has-tip" title="We look at worksheet completions, average scores and logins to calculate your account health. Account health will be either red, amber or green. Good account health means you're getting the best from EdPlace!"><i class="fi-info"></i></span></h5>
          </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="logins-vis">
            <h5>Logins  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of times you and the selected student logged in over the selected time period. This does not include logins on iPad or iPhone."><i class="fi-info"></i></span></h5>
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
        <div class="large-3 columns" >
          <div class="card" id="average-score-vis">
          <h5>Average score (%)  <span data-tooltip aria-haspopup="true" class="has-tip" title="The average score for all worksheets completed in the selected time period."><i class="fi-info"></i></span></h5>
        </div>
        </div>
        <div class="large-3 columns">
          <div class="card" id="ed-av-vis">
          <h5>EdPlace average (%)  <span data-tooltip aria-haspopup="true" class="has-tip" title="The average overall score of EdPlace users in the selected timeframe."><i class="fi-info"></i></span></h5>
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
        <div class="large-3 columns">
          <div class="card" id="rewards-created-vis">
          <h5>Rewards created  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of rewards you created in the selected time period. Rewards can help motivate students to complete more worksheets."><i class="fi-info"></i></span></h5>
        </div>
      </div>
      <div class="large-3 columns end">
        <div class="card" id="badges-vis">
        <h5>Badges  <span data-tooltip aria-haspopup="true" class="has-tip" title="The number of badges the student unlocked in the selected period."><i class="fi-info"></i></span></h5>
      </div>
      </div>
      </div>
      <div id="welcomemessage" class="reveal-modal large" data-reveal>
        <h2>Information for learning dashboard users</h2>
        <p>EdPlace’s new learning dashboard has been developed as part of a research project. Please read the information below before continuing</p>
        <p>The development and evaluation of this learning dashboard forms part of a Masters dissertation project being undertaken by a member of EdPlace staff and overseen by the <strong>University of Liverpool</strong>. EdPlace is the sponsor of the project but is not directly responsible for the design or development of the dashboard.</p>
        <p>The purpose of the research is to understand which learning data parents and educators find useful and to discover the best ways of presenting it. After you have used the dashboard you will be asked to complete a short survey. Your feedback will help the researcher gain a better understanding of the needs of parents and educators and the findings will eventually be published as part of a dissertation.</p>
        <p>No identifying information about you or your students will be stored or processed as part of the research and your survey responses will be entirely anonymous. All data collected as part of the research project will be stored securely.</p>
        <p>Your participation is entirely voluntary and you may withdraw from use of the dashboard and subsequent questionnaires at any time.</p>
        <p>Your use of the dashboard and completion of subsequent surveys should not cause you any harm. If you have any concerns or questions you may contact the researcher at any time by emailing <a href="mailto:will.lord@online.liv.ac.uk">will.lord@online.liv.ac.uk</a>. If you are unsatisfied by the response you receive or have other concerns you may contact the Research Governance Officer at the University of Liverpool by emailing <a href="mailto:liverpoolethics@ohecampus.com">liverpoolethics@ohecampus.com</a> or calling 001-612-312-1210.</p>
        <p>By clicking ‘Continue’ below you agree to the following:</p>
        <ol>
          <li>I confirm that I have read and have understood the information sheet dated 14 October 2015 for the above study. I have had the opportunity to consider the information, ask questions and have had these answered satisfactorily.</li>
          <li>I understand that my participation is voluntary and that I am free to withdraw at any time without giving any reason, without my rights being affected.</li>
          <li>I understand that, under the Data Protection Act, I can at any time ask for access to the information I provide and I can also request the destruction of that information if I wish.</li>
          <li>I agree to take part in the above study</li>
        </ol>
        <a href="#" class="close-reveal-modal button success">Continue</a>
        <p>The contact details of lead Researcher (Principal Investigator) are:</p>
        <ul class="vcard">
  <li class="fn">Will Lord</li>
  <li class="street-address">105 Sumner Street</li>
  <li class="locality">London</li>
  <li><span class="zip">SE1 9HZ</span></li>
  <li class="email"><a href="#">will.lord@online.liv.ac.uk</a></li>
  <li class="phone">020 7183 9818</li>
</ul>



      </div>

     <div id="exitmessage" class="reveal-modal small" data-reveal>
       <h3>Before you leave...</h3>
       <p>Can you spare five minutes to complete a survey on your use of the learning dashboard? Your feedback will help improve the product and contribute to this research project.</p>
       <a href="../" class="button small secondary">Not now thanks</a>&nbsp; &nbsp;<a href="https://edplace.typeform.com/to/IbejKW" class="button small success">Complete survey</a>
     </div>


  </section>
    <script src="viz/all-viz-functional.js" type="text/JavaScript"></script>
    <script src="js/vendor/fastclick.js"></script>
    <script src="js/foundation.min.js"></script>
    <script src="js/foundation/foundation.topbar.js"></script>
    <script>
$(document).ready(function() {
  initialise(7);
  $('#welcomemessage').foundation('reveal', 'open');

});

$(document).foundation();

$("a#7days").click(function(){
    event.preventDefault();
    update();
    redraw(7);

});

$("a#30days").click(function(){
    event.preventDefault();
    update();
    redraw(30);
});

$(".select-student").click(function(){

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

  ga('create', 'UA-21138955-3', 'auto');
  ga('send', 'pageview');

</script>
  </body>
</html>
