<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in(__DIR__) // Scans the current directory
    ->exclude('vendor') // Excludes the vendor directory
    ->ignoreDotFiles(false) // Includes dot files (if needed)
    ->ignoreVCS(true); // Ignores files tracked by VCS (like .git)

$config = new Config();
return $config->setFinder($finder)
    ->setRules([
        '@PSR12' => true, // Enforces the PSR-12 standard
        'array_syntax' => ['syntax' => 'short'], // Example of an individual rule override
    ])
    ->setCacheFile(__DIR__.'/.php-cs-fixer.cache'); // Recommmended for performance

