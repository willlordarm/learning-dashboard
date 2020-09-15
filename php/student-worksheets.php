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
	$result = $dbClassObj->query($allWorksheets);
	$worksheetArray = array();
	   while($r = mysql_fetch_assoc($result)) {
	     $worksheetArray[] = $r;
	   }
	$studentLogins =	"select
        DATE(attempt_date) as loginDate
      from ep_login_attempt
      where user_id = '".$currentStudent."'
        and attempt_status = '1'
      order by attempt_date desc";
     $sResults = $dbClassObj->query($studentLogins);
     $sLoginArray = array();
	   while($r = mysql_fetch_assoc($sResults)) {
		 $sLoginArray[] = $r;
	   }
	   
	   $parentLogins =	"select
        DATE(attempt_date) as loginDate
      from ep_login_attempt
      where user_id = '".$currentParent."'
        and attempt_status = '1'
      order by attempt_date desc";
      $pResults = $dbClassObj->query($parentLogins);
      $pLoginArray = array();
	  while($r = mysql_fetch_assoc($pResults)) {
		$pLoginArray[] = $r;
	  }
	  
	  $studentRewards = "select
	  reward.points_allocated
	, reward.points_collected
	, DATE(reward.dateCreated) as dateCreated
	, DATE(reward.date_collected) as date_collected
	, reward_type.reward_name
	, reward.reward_status
	from ep_rewards reward
	inner join ep_rewards_type reward_type
		on reward.reward_type_id = reward_type.id
	where reward.student_id = '".$currentStudent."'";
	$rResults = $dbClassObj->query($studentRewards);
      $rewardsArray = array();
	  while($r = mysql_fetch_assoc($rResults)) {
		$rewardsArray[] = $r;
	  }
  $dataArray = array();
  $dataArray['results'] = $worksheetArray;
  $dataArray['student_login_count'] = count($sLoginArray);
  $dataArray['parent_login_count'] = count($pLoginArray);
  $dataArray['total_rewards'] = count($rewardsArray);
  return print json_encode(utf8ize($dataArray));
  //return printJson($allWorksheets);

?>
