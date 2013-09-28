#!/bin/php
<?php
if(count($argv) <= 1){
	die("Usage: $argv[0] file1 file2 ... (- for stdin)\n");
}
$content = "";
array_shift($argv);
foreach($argv as $file){
	if($file == '-'){
		$file = '/dev/stdin';
	}
	if(!is_file($file)){
		die("Can not open file $file.\n");
	}
	$content .= "/*$file*/\n" . file_get_contents($file) . "\n";
}

$lines = explode("\n", $content);
$level = 0;
$lquo = ord('{');
$rquo = ord('}');
$ignore = false;
foreach($lines as $content){
	if(!trim($content)){
		continue;
	}
	if($content{0} == '@'){
		$cnt   = count_chars(preg_replace('#([\'"]).*\1#', '', $content));
		$delta = $cnt[$lquo] - $cnt[$rquo];
		if(!$delta){
			continue;
		}
		$level += $delta;
		$ignore = true;
		continue;
	}

	if($level == 0){
		$content = preg_replace('#^(\.[a-zA-Z0-9\-_]+)\s*\{#', '\1() {', $content, 1, $found);
		$ignore  = !$found;
	}
	if(!$ignore){
		echo $content;
		echo "\n";
	}

	$cnt = count_chars(preg_replace('#([\'"]).*\1#', '', $content));
	$level += $cnt[$lquo] - $cnt[$rquo];
	
	if($level == 0 && $ignore){
		$ignore = false;
	}
}
