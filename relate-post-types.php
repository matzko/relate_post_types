<?php
/*
Plugin Name:Relate Post Types
Plugin URI: 
Description: Associate WordPress post types with each other.
Version: 1.0
Author: Austin Matzko
Author URI: http://austinmatzko.com
Site Wide Only: true
Network: true
*/

require_once 'includes/core/control.php';

function load_relate_post_types()
{
	global $relate_post_types_obj;
	$relate_post_types_obj = new Relate_Post_Types_Control;
}

add_action( 'plugins_loaded', 'load_relate_post_types' );
