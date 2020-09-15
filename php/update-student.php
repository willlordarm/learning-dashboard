<?php
//ini_set('display_errors', 'On');
require_once('init.php');

if(isset($_POST['id']) && !empty($_POST['id'])) {
    $_SESSION['currentStudent'] = $_POST['id'];
    foreach($students as $row) {
      if ($row['id'] == $_SESSION['currentStudent']) {
        echo $row['fname'] . $row['lname'];
      };
    };
}
?>
