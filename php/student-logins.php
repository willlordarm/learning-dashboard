<?php
	//ini_set('display_errors', 'On'); // Remove in production
	require_once('sql-functions.php');
	require_once('current-users.php');
	$studentLogins =	"select
        DATE(attempt_date) as loginDate
      from ep_login_attempt
      where user_id = '".$currentStudent."'
        and attempt_status = '1'
      order by attempt_date desc";

  return printJson($studentLogins);

?>
