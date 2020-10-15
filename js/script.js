( function( $ ) {
"use strict";

    $( function() {
		
		var MainStage = function() {


			var $window                   = $( window ),
				windowWidth               = window.innerWidth,
				windowHeight              = window.innerHeight,
				rendererCanvasID          = '3D-particle-effect-canvas';

			var renderer, 
				texture, 
				scene, 
				camera,
				particles,
				imagedata,
				clock        = new THREE.Clock(),
				mouseX       = 0, 
				mouseY       = 0,
				isMouseDown  = true,
				lastMousePos = {x: 0, y: 0},
				windowHalfX  = windowWidth / 2,
				windowHalfY  = windowHeight / 2;




			//particle rotation
			var particleRotation;

			var centerVector = new THREE.Vector3(0, 0, 0);
			var previousTime = 0;



			function init() {

				//@https://github.com/mrdoob/three.js/blob/dev/src/extras/ImageUtils.js#L21
				THREE.ImageUtils.crossOrigin = '';

				//WebGL Renderer		
				renderer = new THREE.WebGLRenderer( { 
										canvas   : document.getElementById( rendererCanvasID ), //canvas
										alpha    : true, 
										antialias: true 
									} );


				renderer.setSize(windowWidth, windowHeight);




				//Scene
				scene = new THREE.Scene();

				//camera
				camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 10000);
				camera.position.set(-100, 0, 600);
				camera.lookAt( centerVector );
				scene.add( camera );


				// instantiate a loader
				var loader = new THREE.TextureLoader();

				// load a resource
				loader.load(
					// resource URL
				//	'data:image/png;base64,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',
					//'data:image/png;base64,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',
					'data:image/png;base64,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',
					// onLoad callback
					function ( texture ) {
						// in this example we create the material when the texture is loaded
						// Get data from an image
						imagedata = getImageData( texture.image );

						// Immediately use the texture for material creation
						var geometry = new THREE.Geometry();
						var material = new THREE.PointsMaterial({
							size: 3,
							//0xffffff
							color: 0xffffff,
							sizeAttenuation: false
						});



						for (var y = 0, y2 = imagedata.height; y < y2; y += 2) {

							for (var x = 0, x2 = imagedata.width; x < x2; x += 2) {

								if ( imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 128 ) {


									// The array of vertices holds the position of every vertex in the model.
									var vertex = new THREE.Vector3();


									vertex.x = Math.random() * 1000 - 500;
									vertex.y = Math.random() * 1000 - 500;
									vertex.z = -Math.random() * 500;

									vertex.destination = {
										x: x - imagedata.width / 2,
										y: -y + imagedata.height / 2,
										z: 0
									};

									vertex.speed = Math.random() / 200 + 0.015;

									geometry.vertices.push( vertex );


								}
							}
						}
						particles = new THREE.Points( geometry, material );

						scene.add( particles );




					},

					// onProgress callback currently not supported
					undefined,

					// onError callback
					function ( err ) {
						console.error( 'An error happened.' );
					}
				);



				// add particle rotation
				particleRotation = new THREE.Object3D();
				scene.add( particleRotation );
				var geometryPR = new THREE.TetrahedronGeometry(2, 0),
					materialPR = new THREE.MeshPhongMaterial({
					color: 0xffffff,
					flatShading: THREE.FlatShading
				});

				for (var i = 0; i < 1000; i++) {
					var mesh = new THREE.Mesh( geometryPR, materialPR );
					mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
					mesh.position.multiplyScalar(90 + (Math.random() * 700));
					mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
					particleRotation.add(mesh);
				}

				var ambientLight = new THREE.AmbientLight(0x999999 );
				scene.add(ambientLight);

				var lights = [];
				//0xffffff
				lights[0] = new THREE.DirectionalLight( 0xc56969, 1 );
				lights[0].position.set( 1, 0, 0 );
				//0x11E8BB
				lights[1] = new THREE.DirectionalLight( 0xc56969, 1 );
				lights[1].position.set( 0.75, 1, 0.5 );
				//0x8200C9
				lights[2] = new THREE.DirectionalLight( 0xa73030 , 1 );
				lights[2].position.set( -0.75, -1, 0.5 );
				scene.add( lights[0] );
				scene.add( lights[1] );
				scene.add( lights[2] );




				//----
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );



				// Fires when the window changes
				window.addEventListener( 'resize', onWindowResize, false );	
			}





			function render() {
				requestAnimationFrame( render );

				var delta      = clock.getDelta(),
					thickness = 40;


				//Need to add judgment to avoid Cannot read property 'geometry' of undefined
				if ( typeof particles != typeof undefined ) {

					for (var i = 0, j = particles.geometry.vertices.length; i < j; i++) {
						var particle = particles.geometry.vertices[i];
						particle.x += (particle.destination.x - particle.x) * particle.speed;
						particle.y += (particle.destination.y - particle.y) * particle.speed;
						particle.z += (particle.destination.z - particle.z) * particle.speed;
					}


					if ( delta - previousTime > thickness ) {
						var index     = Math.floor(Math.random()*particles.geometry.vertices.length);
						var particle1 = particles.geometry.vertices[index];
						var particle2 = particles.geometry.vertices[particles.geometry.vertices.length-index];

						TweenMax.to( particle, Math.random()*2+1, {
										x:    particle2.x, 
										y:    particle2.y, 
										ease: Power2.easeInOut
									});



						TweenMax.to( particle2, Math.random()*2+1, {
										x:    particle1.x, 
										y:    particle1.y, 
										ease: Power2.easeInOut
									});

						previousTime = delta;
					}


					particles.geometry.verticesNeedUpdate = true;	
				}


				if( ! isMouseDown ) {
					camera.position.x += (0-camera.position.x)*0.06;
					camera.position.y += (0-camera.position.y)*0.06;
				}


				camera.position.x += ( mouseX - camera.position.x ) * 0.09;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.09;
				camera.lookAt( centerVector );


				//particle rotation
				particleRotation.rotation.x += 0.0000;
				particleRotation.rotation.y -= 0.0040;


				renderer.render( scene, camera );

			}



			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}


			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

				if( isMouseDown ) {
					camera.position.x += (event.clientX-lastMousePos.x)/100;
					camera.position.y -= (event.clientY-lastMousePos.y)/100;
					camera.lookAt( centerVector );
					lastMousePos = {x: event.clientX, y: event.clientY};
				}


			}


			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}
			}


			function onDocumentMouseUp() {
				isMouseDown = false;
			}

			function onDocumentMouseDown( event ) {
				isMouseDown = true;
				lastMousePos = {x: event.clientX, y: event.clientY};


			}



			/*
			 * Get Image Data when Draw Image To Canvas
			 *
			 * @param  {Object} image         - Overridden with a record type holding data, width and height.
			 * @return {JSON}                 - The image data.
			 */
			function getImageData( image ) {

				var canvas = document.createElement( 'canvas' );
				canvas.width = image.width;
				canvas.height = image.height;

				var ctx = canvas.getContext( '2d' );
				ctx.drawImage(image, 0, 0);

				return ctx.getImageData(0, 0, image.width, image.height);
			}



			// 
			//-------------------------------------	
			return {
				init      : init,
				render    : render,
				getScene  : function () { return scene; },
				getCamera : function () { return camera; } 
			};


		}();

		MainStage.init();
		MainStage.render();
		


    } );
    
    
} ) ( jQuery );