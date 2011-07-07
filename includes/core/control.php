<?php

class Relate_Post_Types_Control
{
	public $plugin_dir;

	public function __construct()
	{
		$this->plugin_dir = dirname( dirname( dirname( __FILE__ ) ) );
		add_action( 'init', array( $this, 'event_init' ) );

		if ( is_admin() ) {
			include_once $this->plugin_dir . '/includes/wp-filosofo-js/wp-filosofo-js-library.php';
			include_once $this->plugin_dir . '/includes/wp-json-rpc-api/wp-json-rpc-api.php';

			if ( ! did_action( 'wp_json_rpc_api_instantiated' ) ) {
				load_wp_json_rpc_api();
			}
			
			include_once $this->plugin_dir . '/includes/json-server-class.php';

			add_action( 'add_meta_boxes', array($this, 'event_add_meta_boxes_relate_post_type'));
			add_action( 'admin_init', array( $this, 'event_admin_init' ) );
		}
	}

	public function event_add_meta_boxes_relate_post_type( $post_type = null )
	{
		$post_types = get_post_types( array('show_ui' => true, 'public' => true ) );
		foreach( (array) $post_types as $post_type_name ) {
			add_meta_box('extra-data', __( 'Associate Post Types', 'relate-post-types' ), array( $this, 'print_meta_box' ), $post_type_name, 'normal' );
		}
	}

	public function event_admin_init()
	{
		wp_enqueue_script(
			'relate-post-types-admin-js',
			plugin_dir_url( $this->plugin_dir . '/relate-post-types.php' ) . 'client-files/js/relate-post-types-admin.js',

			array( 'filosofo-common-js', 'json-rpc-api-helper' ),
			'1.0'
		);
		
		wp_enqueue_style(
			'relate-post-types-admin-css',
			plugin_dir_url( $this->plugin_dir . '/relate-post-types.php' ) . 'client-files/css/relate-post-types-admin.css',

			null,
			'1.0'
		);
	}

	public function event_init()
	{
		load_plugin_textdomain('relate-post-types', false, dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'l10n' );
	}

	public function associate_posts_and_update( $current_post_id = 0, $post_to_associate = 0 )
	{
		$current_post_id = (int) $current_post_id;
		$post_to_associate = (int) $post_to_associate; 
		if ( $this->associate_posts( $current_post_id, $post_to_associate ) ) {
			$ass_post = get_post( $post_to_associate );
			ob_start();
			$this->print_associated_posts( $current_post_id, $ass_post->post_type );
			return array(
				'markup' => ob_get_clean(),
				'post_type' => $ass_post->post_type,
			);
		}
	}

	public function disassociate_posts_and_update( $current_post_id = 0, $post_to_associate = 0 )
	{
		$current_post_id = (int) $current_post_id;
		$post_to_associate = (int) $post_to_associate; 
		if ( $this->disassociate_posts( $current_post_id, $post_to_associate ) ) {
			$ass_post = get_post( $post_to_associate );
			ob_start();
			$this->print_associated_posts( $current_post_id, $ass_post->post_type );
			return array(
				'markup' => ob_get_clean(),
				'post_type' => $ass_post->post_type,
			);
		}
	}

	public function associate_posts( $current_post_id = 0, $post_to_associate = 0 )
	{
		$current_post_id = (int) $current_post_id;
		$post_to_associate = (int) $post_to_associate; 

		if ( 
			current_user_can( 'edit_post', $current_post_id ) && 
			current_user_can( 'edit_post', $post_to_associate )
		) {
			delete_post_meta( $post_to_associate, 'associated_item', $current_post_id );
			add_post_meta( $post_to_associate, 'associated_item', $current_post_id );
			return true;
		}

		return false;
	}

	public function disassociate_posts( $current_post_id = 0, $post_to_associate = 0 )
	{
		$current_post_id = (int) $current_post_id;
		$post_to_associate = (int) $post_to_associate; 

		if ( 
			current_user_can( 'edit_post', $current_post_id ) && 
			current_user_can( 'edit_post', $post_to_associate )
		) {
			delete_post_meta( $post_to_associate, 'associated_item', $current_post_id );
			return true;
		}

		return false;
	}

	public function lookup_related_posts( $query_text = '', $post_type = 'post' ) 
	{
		if ( current_user_can( 'edit_posts' ) ) {
			if ( post_type_exists( $post_type ) ) {
				$posts = get_posts( array(
					'post_type' => $post_type,
					's' => $query_text,
					'showposts' => 20,
				) );

				$results = array();
				foreach( (array) $posts as $post ) {
					$results[] = array(
						'title' => get_the_title( $post->ID ),
						'link' => get_permalink( $post->ID ),
						'id' => (int) $post->ID,
					);
				}

				return $results;
			} else {
				return new WP_Error(
					-34000,
					__( 'Attempting to look up an invalid post type.', 'relate-post-types' )
				);
			}
		} else {
			return new WP_Error(
				-34000,
				__( 'You do not have permission to look for related content.', 'relate-post-types' )
			);
		}
	}

	public function print_meta_box( $post_object = null )
	{
		?><div id="relate-post-types-meta-info">
			<input type="hidden" id="relate-post-type-associated-item-id" value="<?php echo (int) $post_object->ID; ?>" />
			<fieldset><legend><?php _e( 'Associate Other Content', 'relate-post-types' ); ?></legend></fieldset><?php
			$post_types = get_post_types( array('show_ui' => true, 'public' => true ) );
			foreach( (array) $post_types as $post_type_name ) :
				$post_type = get_post_type_object( $post_type_name );
				?>
				<div class="relate-post-type-post-type-wrap <?php echo $post_type_name; ?>">
					<h4><?php echo $post_type->label; ?></h4>
					<div class="relate-post-type-autosuggest-wrap" id="relate-post-type-<?php echo $post_type_name; ?>-autosuggest-wrap">
						<input type="text" id="relate-post-type-<?php echo $post_type_name; ?>-autosuggest-field" value="" class="relate-post-type-autosuggest-field" />
						<div class="relate-post-type-autosuggest-results" id="relate-post-type-<?php echo $post_type_name; ?>-autosuggest-results"></div>
					</div>


					<ul class="relate-post-type-associated" id="relate-post-type-<?php echo $post_type_name; ?>-associated">
					<?php 
						$this->print_associated_posts( $post_object->ID, $post_type_name )
					?>
					</ul>
				</div>
				<?php
			endforeach;
			?></legend></fieldset>
		</div><?php 
	}

	public function print_associated_posts( $post_id = 0, $post_type = 'post' )
	{
		$post_id = (int) $post_id;
		if ( post_type_exists( $post_type ) ) {
			$q = new WP_Query( array(
				'meta_key' => 'associated_item',
				'meta_value' => $post_id,
				'post_type' => $post_type,
			) );
			while ( $q->have_posts() ) : $q->the_post();
				?>
				<li class="relate-post-type-associated-item">
					<a href="#" class="relate-post-type-assoc-remove relate-post-type-remove-assoc-<?php the_ID(); ?>">X</a>
					<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				</li>
				<?php
			endwhile;
		}
	}
}
