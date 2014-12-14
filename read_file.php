<?php

$f = fopen('Shape.js', 'r');

$contents = fread($f, 100000);

echo $contents;

fclose($f);