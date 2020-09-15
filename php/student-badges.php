<?php
	//ini_set('display_errors', 'On'); // Remove in production
	require_once('sql-functions.php');
	require_once('current-users.php');

  $studentBadges = "select
      DATE(badges_as.created_date) as dateUnlocked ,
      badges_con.badges ,
      badges_con.badge_title ,
      badges_con.badges_type ,
      subject.subject ,
      wsyears.`year` ,
      curriculum.ksu ,
      wstopic.topicTags
    from ep_badges_assigned badges_as
    inner join ep_badges_condition badges_con
     on badges_as.assigned_badges_id = badges_con.id
    inner join ep_wssubjects subject
    	on badges_con.subject_id = subject.id
    inner join ep_wsyears wsyears
    	on badges_con.year_id = wsyears.id
    left join ep_wstopictags wstopic
    	on badges_con.topic_id = wstopic.id
    left join ep_wsksu curriculum
    	on badges_con.curriculum_id = curriculum.id
    where badges_as.student_id = 1505
		and badges_as.is_found = '1'";

    return printJson($studentBadges);
  ?>
