<?php

class Relate_Post_Types_JSON_RPC_Server extends WP_JSON_RPC_Server {
	
	public function __construct()
	{
		$this->methods['relatePostTypes.associatePosts'] = 'this:associatePosts';
		$this->methods['relatePostTypes.disAssociatePosts'] = 'this:disAssociatePosts';
		$this->methods['relatePostTypes.lookupRelated'] = 'this:lookupRelated';
	}

	public function associatePosts( $args = null )
	{
		global $relate_post_types_obj;
		if ( 
			isset( $args->{'currentPostID'} ) && 
			isset( $args->{'postToAssociate'} )
		) {
			return $relate_post_types_obj->associate_posts_and_update( $args->{'currentPostID'}, $args->{'postToAssociate'} );
		}
	}

	public function disAssociatePosts( $args = null )
	{
		global $relate_post_types_obj;
		if ( 
			isset( $args->{'currentPostID'} ) && 
			isset( $args->{'postToDisAssociate'} )
		) {
			return $relate_post_types_obj->disassociate_posts_and_update( $args->{'currentPostID'}, $args->{'postToDisAssociate'} );
		}
	}

	public function lookupRelated( $args = null )
	{
		global $relate_post_types_obj;
		if ( 
			isset( $args->{'text'} ) && 
			isset( $args->{'post_type'} )
		) {
			return $relate_post_types_obj->lookup_related_posts( $args->{'text'}, $args->{'post_type'} );
		}
	}
}

function relate_post_types_filter_json_server_classname( $server_class = '', $method = '' )
{
	switch( $method ) :
		case 'relatePostTypes.associatePosts' :
		case 'relatePostTypes.disAssociatePosts' :
		case 'relatePostTypes.lookupRelated' :
			$server_class = 'Relate_Post_Types_JSON_RPC_Server';
		break;
	endswitch;
	return $server_class;
}

add_filter('json_server_classname', 'relate_post_types_filter_json_server_classname', 10, 2);
