<?php

  require_once('sql-functions.php');

  $average30Days = "select
    ROUND(AVG(ROUND((score_collected / score_total) * 100))) as 'Percentage'
    from ep_wsassigned
    where score_collected is not null
    and dateAppeared > DATE_SUB(now(), interval 30 day)";

  return printJson($average30Days);
  ?>
