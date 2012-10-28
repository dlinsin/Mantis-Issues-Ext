# Mantis Issues Ext

A __Safari Extension__ which extracts information from an issue of a [Mantis bugtracking system](http://www.mantisbt.org/) 
and adds it to a [GitHub issue](https://github.com/dlinsin/Mantis-Issues-Ext/issues).

Written by [David Linsin](http://dlinsin.github.com), January 2012.

## Installation

Download the [latest version](https://github.com/downloads/dlinsin/Mantis-Issues-Ext/mantis_issues_ext-1.6.safariextz) of the Safari Extension 
and double click to install it.

## Usage

1. Open a new Tab and navigate to any [Mantis Issue](http://www.mantisbt.org/demo/view.php?id=11254). 
A right click anywhere on the site will bring up the context menu item _Copy Mantis Info_. 
Clicking it will extract the following information:

  * ID
  * Summary
  * Description
  * Additional Information
  * URL
  * Platform
  * OS
  * OS Version
  * Product Version
  * Target Version

Alternatively you can use the keyboard shortcut _SHIFT+CTRL+M_ to extract the information 
directly.

2. Create a [new GitHub Issue](https://github.com/dlinsin/Mantis-Issues-Ext/issues/new) and 
bring up the context menu by right clicking anywhere on the site. Click on the menu item 
_Add Mantis Info_ which will set the following Mantis infos:

  * the title to Summary
  * a block quote containing the Description, Additional Information
  * the fields mentioned above in form of _column: value_ 
  * the ID as a link to the URL of the issue

Alternatively you can use the keyboard shortcut _SHIFT+CTRL+I_ to add the information to the 
new issue directly.

## Known Issues

### General

Unfortunately Mantis doesn't support HTML id attributes for their content. As a workaround 
the Mantis site is being parsed and the script looks for the column content such as "Summary". 
Since Mantis can be localized, the script takes that into consideration. However, at the moment it 
only can extract information from German or English Mantis installations. 

### GitHub Issue Submit Button

Under some circumstances the _Submit new Issue_ button on a GitHub issue might stay disabled after 
inserting the Mantis information. As a workaround, you can simply add any character to the title of 
the issue, that's the reason why it's being focused right after insertion.

## Issues and Feature Requests

Please report issues via GitHub's issue tracker.

## License

Mantis Issues Ext is licensed under the Apache 2 License, expect for shortcuts.js which is 
licenses under BSD and cvi_busy_lib.js which is under the [Netzgestade Non-commercial Software License Agreement](http://www.netzgesta.de/cvi/LICENSE.html). 
