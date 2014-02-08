!function() {

    var responsive_images = {
        init: function(widths) {
            // Available image widths
            this.widths = widths;
            // Is this.resizeImages currently running?
            this.is_resizing = false;
            // Convert divs to imgs
            this.change_divs_to_imgs();
            // Kick off image enhancement
            this.init_resize_images();
        },
        change_divs_to_imgs: function() {
            $('div.js-delayed_image_load').each(function(index, div) {
                div = (typeof div !== "number") ? div : index; // get round jquery/ender differences?
                if (div.className.search('js-no_replace') > -1) {
                    return;
                }
                // if (div.getAttribute('data-caption')) {
                //     var orientation = "";
                //     if (div.className.indexOf('portrait') > -1) {
                //         orientation = "portrait";
                //     }
                //     else {
                //         orientation = "landscape";
                //     }
                //     $(div).after('<div class="image-caption image-caption--' + orientation + '">' + (div.getAttribute('data-caption') || '') + '</div>');
                // }
                var additional_classes = div.className.replace('js-delayed_image_load', ''),
                    img = $(
                        '<img src="' + 
                        responsive_images.calc_img_src(div.getAttribute('data-src'), div.clientWidth) + 
                        '" alt="' + 
                        (div.getAttribute('data-alt') || "") + 
                        '" class="js-image_replace ' + 
                        additional_classes + 
                        '" />'
                    );
                $(div).replaceWith(img[0]);
            });
        },
        /*
            calc_img_src: returns a new URL for img which is a best fit for the supplied width
            @imgSrc Current img src
            @width  CSS width value of the image
        */
        calc_img_src: function(imgSrc, width) {
            if (imgSrc === null) return false; // make sure to return false if we can't use the value
            var regex = imgSrc.match(/img\/(\d*)/) || imgSrc;
            if (regex === null || typeof regex == 'string') return false; // make sure to return false if we can't use the value
            return imgSrc.replace(/img\/(\d*)/, "img/" + this.match_closest_value(width, this.widths));
        },
        /*
            match_closest_value: returns a value closest to (but not over) from the array 'widths'
            @width Value to match against
        */
        match_closest_value: function(value, values) {
            var prev_value = values[0];
            for(var z = 0, len = values.length; z < len; z++) {
                if (value < values[z]) {
                    return prev_value;
                }
                prev_value = values[z];
            }
            return prev_value;
        },
        init_resize_images: function() {
            $(window).bind('resize', function() {
              responsive_images.resize_images();
            });
            if (pubsub) {
                pubsub.addListener('resize_images', function () {
                    responsive_images.resize_images();
                });
                pubsub.addListener('init_images', function () {
                    responsive_images.change_divs_to_imgs();
                });
            }
        },
        resize_images: function() {
            var node_list = $('.js-image_replace');

            if (!this.is_resizing) {
                this.is_resizing = true;

                if (node_list !== null) { // reference error occurs when the user manually resizes the browser window (this prevents it) 
                    node_list.each(function(node) {
                        if (node.getAttribute('class').match('js-no_replace')) {
                          return;
                        }

                        // Set src to value of calc_img_src if value is not false;
                        var newImgSrc = responsive_images.calc_img_src(
                            (node.getAttribute('datasrc') || node.src),
                            node.clientWidth
                        );
                        if (!!newImgSrc && (node.src != newImgSrc)) {
                            node.src = newImgSrc;
                        }
                    });
                }
                this.is_resizing = false;
            }
        }
    };

    responsive_images.init([96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736]);

}();