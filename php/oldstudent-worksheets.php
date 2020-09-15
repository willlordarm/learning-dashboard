<?php
	//ini_set('display_errors', 'On'); // Remove in production
	require_once('sql-functions.php');
	require_once('current-users.php');

$allWorksheets = "select was.worksheetId
    , DATE(was.dateAppeared) as dateAppeared
    , was.score_total
    , was.score_collected
    , ws.worksheetName
    , ws.`level`
    , sub.subject
    , topic.topicTags
    , curriculum.ksu
    , wsyears.`year`
    , ROUND((was.score_collected / was.score_total) * 100) as 'Percentage'
    from ep_wsusers us
    inner join ep_wsassigned was
      on us.id = was.studentId
    inner join ep_worksheets ws
      on ws.id = was.worksheetId
    inner join ep_wssubjects sub
      on sub.id = ws.subject
    inner join ep_wstopictags topic
      on topic.id = ws.topic_id
    inner join ep_wsksu curriculum
      on ws.ksu = curriculum.id
    inner join ep_wsyears wsyears
      on ws.`year` = wsyears.id
    where us.id = $currentStudent
      and was.score_collected is not null
			and was.dateAppeared > DATE_SUB(now(), interval 365 day)
      order by was.dateAppeared DESC";

      return printJson($allWorksheets);

?>
