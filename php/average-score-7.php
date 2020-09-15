<?php

  require_once('sql-functions.php');

  $average7Days = "select
    ROUND(AVG(ROUND((score_collected / score_total) * 100))) as 'Percentage'
    from ep_wsassigned
    where score_collected is not null
    and dateAppeared > DATE_SUB(now(), interval 7 day)";

  return printJson($average7Days);
  ?>
