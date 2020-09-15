<?php
	//ini_set('display_errors', 'On'); // Remove in production
	require_once('sql-functions.php');
	require_once('current-users.php');

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

return printJson($studentRewards);
?>
