
//$LAB.script('http://maps.googleapis.com/maps/api/js?sensor=true').wait()


var fpSrc = [ 'fp/fp.min.js' ];
if (node_env == 'development') {
    fpSrc = [
         'fp/core/universe.js'
         , 'fp/core/catastrophe.js'
         , 'fp/core/agent/agent.js' , 'fp/core/agent/culture.js' , 'fp/core/agent/beliefs.js' , 'fp/core/agent/desires.js' , 'fp/core/agent/capabilities.js' , 'fp/core/agent/characteristics.js' , 'fp/core/agent/plans.js'
         , 'fp/core/campaign.js', 'fp/core/cell.js', 'fp/core/world.js', 'fp/core/wave.js', 'fp/core/resource.js', 'fp/core/species.js', 'fp/core/terrain.js', 'fp/core/tile.js'
         , 'fp/core/module-manager.js' , 'fp/core/module.js', 'fp/core/lifecycle.js', 'fp/core/statistics.js'

        , 'fp/core/agent/defaults/default_cultures.js'

        , 'fp/profile/profile.js', 'fp/profile/profile_class.js', 'fp/event/event.js'
         , 'fp/graphics/drawing.js', 'fp/graphics/orientation.js', 'fp/graphics/isometric.js', 'fp/graphics/fullscreen.js', 'fp/graphics/stick-figure.js'

         , 'fp/ui/dialogs/dialogs.js'
         , 'fp/ui/controls.js'
         , 'fp/ui/keyboard.js'
         , 'fp/ui/mouse.js'
         , 'fp/ui/editor.js'
         , 'fp/ui/general-ui.js'
         , 'fp/ui/world-gallery.js'
         , 'fp/ui/world-ui.js'
         , 'fp/ui/notice.js'
         , 'fp/ui/profile-ui.js'
         , 'fp/ui/resource-ui.js'
         , 'fp/ui/graph.js'
         , 'fp/ui/slider.js'
         , 'fp/ui/module-editor.js'
         , 'fp/ui/parameters.js'
         , 'fp/ui/console.js'
         , 'fp/ui/storyboard.js'
         , 'fp/ui/google-map.js'

         , 'fp/utils/fp-utils.js', 'fp/utils/log.js', 'fp/utils/recording.js', 'fp/utils/url-params.js'
        , 'fp/utils/comms.js'
        , 'fp/game.js'
    ];

}

$LAB
    .setOptions({BasePath:'/javascripts/'})


    // Load JQuery
//   .script('jquery/jquery-1.7.1.min.js')

    // Load JQuery UI & Plug-ins
    .script([

//        'jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js'
//        , 'jquery.balloon/jquery.balloon.js'
        , 'jquery/jquery.zoom.js'
    ])

    // Load other libraries
    .script([
    , 'flot-0.7/flot/jquery.flot.min.js'
    , 'jq-console/jqconsole-2.7.min.js'
    , 'jstat-2.0/jstat.js'
    , 'one-color/one-color-all.js'
    , 'socket.io/socket.io.js'
    , 'sylvester/sylvester.js'
    , 'underscore/underscore-min.js'
    ])

        // Load FiercePlanet other plugins
   .script(
        fpSrc
    )

    .script([
     , 'fp/default-module/default-module.js'
     , 'fp/default-module/resources/tbl.js'
     , 'fp/default-module/resources/cos.js'
     , 'fp/default-module/resources/resource_types.js'
     , 'fp/default-module/worlds/basic.js'
     , 'fp/default-module/worlds/additional.js'
    ])
    .wait(function() {
        FiercePlanet.GoogleMapUtils.initMaps();
        var m = urlParams.module;
        $LAB.setOptions({BasePath:'/javascripts/'}).script([
            , 'fp-modules/trials/wv/wv-module.js'
        ]).wait(function() {
                // Add callbacks to lifecycle
                FiercePlanet.Game.setupLifecycle();

//                $('#moduleEditor').show();
                WorldVisionModule.init();

                FiercePlanet.Orientation.initialiseParameters($('#world-container').width(), $('#world-container').height());

                Lifecycle._initialiseGame();
                console.log(FiercePlanet.Orientation.cellWidth)


                FiercePlanet.GeneralUI.worldInfo();


                // Draw the game
                //Lifecycle.newWorld();

            })


        /*
            DefaultModule.init();
            $('#content-pane').show();
            if (window.location.pathname === '/mobile') {
                Universe.settings.mobile = true;
                Universe.settings.useInlineResourceSwatch = true;
                FiercePlanet.Orientation.worldWidth = $(window).width();
                FiercePlanet.Orientation.worldHeight = $(window).height() - 160;
            }
            FiercePlanet.Game.loadGame();
            */
        var world = urlParams.world;
        if (!_.isUndefined(world)) {
            Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = world;
        }
    })

