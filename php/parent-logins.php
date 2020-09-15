<?php
	//ini_set('display_errors', 'On'); // Remove in production
	require_once('sql-functions.php');
	require_once('current-users.php');

$parentLogins =	"select
        DATE(attempt_date) as loginDate
      from ep_login_attempt
      where user_id = '".$currentParent."'
        and attempt_status = '1'
      order by attempt_date desc";

  return printJson($parentLogins);

?>
