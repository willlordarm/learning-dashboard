<?php
//include_once('../../header.php');
$rootDir = $_SERVER['DOCUMENT_ROOT'].'/';
include_once($rootDir.'header.php');
function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}

function printJson($sql) {
  global $dbClassObj;
  $result = $dbClassObj->query($sql);
  $rows = array();
	   while($r = mysql_fetch_assoc($result)) {
	     $rows[] = $r;
	   }
	print '{"results":' . json_encode(utf8ize($rows)).'}';
};

function getResults($sql) {
  global $dbClassObj;
	$result = $dbClassObj->query($sql);
	$rows = array();
	   while($r = mysql_fetch_assoc($result)) {
	     $rows[] = $r;
	   }
	return $rows;
};
?>
