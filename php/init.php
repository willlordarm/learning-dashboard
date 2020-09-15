<?php
//ini_set('display_errors', 'On');
$rootDir = $_SERVER['DOCUMENT_ROOT'].'/';
//include_once('../../header.php');
include_once($rootDir.'header.php');
require_once('sql-functions.php');
$parentId = $_SESSION['sessU_uid'];
if(!isset($parentId) || $parentId==''){
	header('Location:'.SITE_NAME.'parent'); exit;
}
$activeStudents = "select
      lname
    , fname
    , id
    , user_name
    , subject
    , student_year
    , worksheet_assigned
    , worksheet_completed
    from ep_wsusers
    where `status` = '1'
      and parent_id = '".$parentId."'";

$students = getResults($activeStudents);

$_SESSION['currentStudent'] = $students[0]['id'];

function getUserName() {
  global $students;
  foreach($students as $row) {
  if ($row['id'] == $_SESSION['currentStudent']) {
    echo $row['fname'] . $row['lname'];
  };
};
};
?>
