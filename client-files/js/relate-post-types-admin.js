(function( f ) {
	if ( ! f || 'undefined' == typeof wpJSON )
		return;

	var d = document,
	
	fireEvent = function( el, eventName ) {
		var evt;

		if ( d.createEvent ) {
			evt = d.createEvent('HTMLEvents');
			evt.initEvent( eventName, true, true );
			return ! el.dispatchEvent( evt );
		} else if ( d.createEventObject ) {
			evt = d.createEventObject();
			return el.fireEvent( 'on' + eventName, evt );
		}
	},

	attachAutosuggestEventListeners = function( parentEl ) {
		var inputs = parentEl.getElementsByTagName( 'input' ),
		i = inputs.length,
		matches;
		while( i-- ) {
			if ( inputs[i] && inputs[i].className && -1 != inputs[i].className.indexOf( 'relate-post-type-autosuggest-field' ) ) {
				matches = inputs[i].id ? /relate-post-type-(.*)-autosuggest-field/.exec( inputs[i].id ) : [];
				if ( matches && matches[1] ) {
					(function(postType, el) {
						var wrap = el.parentNode,
						divs = wrap ? wrap.getElementsByTagName( 'div' ) : [],
						i = divs.length;

						while( i-- ) {
							if ( 
								divs[i] && 
								divs[i].className && 
								-1 != divs[i].className.indexOf( 'relate-post-type-autosuggest-results' ) ) {
								autosuggestWrappers[postType] = divs[i];
								break;
							}
						}

						f.addEvent( el, 'keydown', function(e) {
							e.postType = postType;
							return eventKeyDown.call( this, e ); 
						} );
						
						f.addEvent( el, 'keyup', function(e) {
							e.postType = postType;
							return eventKeyUp.call( this, e ); 
						} );

						f.addEvent( el, 'focus', function() {
							var list = autosuggestLists[postType] ? autosuggestLists[postType] : false;
							var i;
							for ( i in autosuggestLists ) {
								if ( 
									f.isObjProperty( autosuggestLists, i ) &&
									autosuggestLists[i] 
								) {
									autosuggestLists[i].style.display = 'none';
									makeSuggestionActive( false ); 
								}
							}
						} );
					})(matches[1], inputs[i]);
				}
			}
		}
	},
	
	eventClickRemove = function( ev ) {
		var target = f.getEventTarget( ev ),
		matches = target ? /relate-post-type-remove-assoc-([0-9]+)/.exec( target.className ) : [];
		if ( matches && matches[1] ) {
			wpJSON.request(
				'relatePostTypes.disAssociatePosts',
				{'currentPostID':currentPostID,'postToDisAssociate':matches[1]},
				handleAssociateResponse
			);
		}
	},

	eventKeyDown = function( ev ) {
		var key = ev && ev.keyCode ? ev.keyCode : null,
		halt = false;
		
		if ( key ) {
			switch ( key ) {
				case 13 : // carriage return
					if ( getActiveElement() ) {
						chooseActiveElement( getActiveElement() );
					}
					halt = true;
				break;

				case 38 : // arrow up
					moveArrowUp.call( this );
				break;

				case 40 : // arrow down
					moveArrowDown.call( this );
				break;
			}
		}

		if ( halt ) {
			if ( ev.preventDefault )
				ev.preventDefault();
			if ( ev.stopPropagation )
				ev.stopPropagation();
			ev.cancelBubble = true;
			ev.returnValue = false;
			return false;
		}
	},

	eventKeyUp = function( ev ) {
		var key = ev && ev.keyCode ? ev.keyCode : null;
		
		if ( key ) {
			switch ( key ) {
				case 13 : // carriage return
				case 38 : // arrow up
				case 40 : // arrow down
					return;
				break;
			}
		}
		
		if ( this && this.value && 3 < this.value.length ) {
			lookupRelatedValues.call( this, this.value, ( ev.postType ? ev.postType : 'post' ) );
		}
	},
	
	handleAssociateResponse = function( result ) {
		if ( result ) {
			var markup = result.markup ? result.markup : '',
			list,
			postType = result.post_type,
			wrap = d.getElementById( 'relate-post-type-' + postType + '-associated' );
			
			if ( autosuggestLists[postType] ) {
				list = autosuggestLists[postType];
				list.style.display = 'none';
				makeSuggestionActive( false ); 
			}

			if ( wrap ) {
				wrap.innerHTML = result.markup;
			}
		}
	},

	handleRelatedLookupResponse = function( result, postType ) {
		if ( result && postType ) {
			showSuggestions.call( this, result, postType );
		}
	},

	lookupRelatedValues = function( text, postType ) {
		var el = this;
		wpJSON.request(
			'relatePostTypes.lookupRelated',
			{'text':text,'post_type':postType},
			function( r ) { handleRelatedLookupResponse.call( el, r, postType ); }
		);
	},
	
	moveArrowDown = function() {
		var inputEl = this,
		active = getActiveElement(),
		items = [],
		i;
		if ( active ) {
			makeElementActive( active, 'next' );
		} else {
			items = inputEl.parentNode.getElementsByTagName('li');
			for ( i = 0; i < items.length; i++ ) {
				if ( items[i] && items[i].className && -1 != items[i].className.indexOf('relate-post-type-suggestion-list-item') ) {
					makeSuggestionActive( items[i] );
				}
			}

		}
	},

	moveArrowUp = function() {
		var inputEl = this,
		active = getActiveElement(),
		items = [],
		i;
		if ( active ) {
			makeElementActive( active, 'prev' );
		} else {
			items = inputEl.parentNode.getElementsByTagName('li');
			while ( i-- ) {
				if ( items[i] && items[i].className && -1 != items[i].className.indexOf('relate-post-type-suggestion-list-item') ) {
					makeSuggestionActive( items[i] );
				}
			}
		}
	},
	
	chooseActiveElement = function( el ) {
		if ( ! el ) {
			return;
		}
		var links = el.getElementsByTagName( 'a' ),
		i = links.length;
		while ( i-- ) {
			if ( links[i] ) {
				fireEvent( links[i], 'click' ); 
			}
		}
	},

	chooseSuggestion = function( postID ) {
		wpJSON.request(
			'relatePostTypes.associatePosts',
			{'currentPostID':currentPostID,'postToAssociate':postID},
			handleAssociateResponse
		);
	},

	_currentActiveEl,
	_currentActivePostType,
	getActiveElement = function() {
		return _currentActiveEl;
	},

	makeSuggestionActive = function( parentListItem ) {
		if ( false === parentListItem ) {
			_currentActiveEl = false;
		}

		if ( _currentActiveEl && _currentActiveEl != parentListItem ) {
			_currentActiveEl.className = _currentActiveEl.className.replace( /\s*active\\b/, '' );
		} else if ( _currentActiveEl && _currentActiveEl == parentListItem ) {
			return;
		}

		_currentActiveEl = parentListItem;
		_currentActiveEl.className = _currentActiveEl.className ? _currentActiveEl.className : '';
		_currentActiveEl.className += ' active';
		if ( _currentActiveEl.focus )
			_currentActiveEl.focus(); 
	},

	makeElementActive = function( el, direction ) {
		var name = el && el.nodeName ? el.nodeName.toLowerCase() : '',
		others = [],
		i;

		if ( name ) {
			others = el.parentNode.getElementsByTagName( name );
			i = others.length;
			while( i-- ) {
				if ( others[i] && el == others[i] ) {
					if ( 'next' == direction && others[i+1] ) {
						makeSuggestionActive( others[i+1] );
					} else if ( 'prev' == direction && others[i-1] ) {
						makeSuggestionActive( others[i-1] );
					}
				}
				break;
			}
		}
	},

	showSuggestions = function( results, postType ) {
		var wrap = autosuggestWrappers[postType],
		list,
		li, link, text,
		i = 0;

		if ( autosuggestLists[postType] ) {
			list = autosuggestLists[postType];
			list.style.display = 'block';
		} else {
			list = d.createElement('ul');
			autosuggestLists[postType] = list;
			wrap.appendChild(list);
		}

		list.innerHTML = '';

		for ( i; i < results.length; i++ ) {
			if ( 
				results[i] &&
				results[i].id &&
				results[i].link &&
				results[i].title
			) {
				li = d.createElement( 'li' );
				a = d.createElement( 'a' );
				a.href = results[i].link;
				li.className = 'relate-post-type-suggestion-list-item';
				a.appendChild( d.createTextNode( results[i].title ) );

				(function(a, li, inputEl, chosenID ) {
					a.onclick = function() {
						chooseSuggestion.call( inputEl, chosenID );	
						return false;
					}

					a.onmouseover = function() {
						makeSuggestionActive( li ); 
					}
				})(a, li, this, results[i].id);

				li.appendChild( a );
				list.appendChild( li );
			}
		}
	},

	currentPostID,
	autosuggestWrappers = {},
	autosuggestLists = {},

	init = function() {
		var sectionWrap = d.getElementById( 'relate-post-types-meta-info' ),
		postIDEl = d.getElementById('relate-post-type-associated-item-id');

		currentPostID = postIDEl && postIDEl.value ? parseInt( postIDEl.value, 10 ) : 0;
		if ( sectionWrap ) {
			attachAutosuggestEventListeners( sectionWrap );
			f.attachClassClickListener( 'relate-post-type-assoc-remove', eventClickRemove, sectionWrap ); 
		}
	}
	
	f.doWhenReady( init );

})( 'undefined' != typeof FilosofoJS ? new FilosofoJS() : null );
