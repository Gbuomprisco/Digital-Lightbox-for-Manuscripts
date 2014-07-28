this.import = {
    _self: this,
    open: false,
    manager: false,
    files: [],

    init: function() {

        this.buttons();
        this.refresh();

    },

    show: function() {
        this.open = true;
        var import_element = $('#import');
        if (!this.manager) {

            var button_position = $('#load').position();
            import_element.css({
                'top': $('#buttons').position().top + button_position['top'],
                'left': "2%"
            });
            $('#load').hide();
            import_element.show().animate({
                "top": "14%",
                'left': "28%",
                'width': "40%",
                'height': "25%",
                'opacity': 1,
                'z-index': 400
            }, {
                duration: 250,
                complete: function() {
                    $('#close_import').click(function() {
                        _self.import.hide();
                    });


                    $('#open_load_from_pc').click(function() {
                        _self.import.show_manager();
                    });
                }
            }).draggable({
                handle: '.top_box'
            });
        } else {
            import_element.show().animate({
                "top": "5%",
                'left': "20%",
                'width': "60%",
                'height': "90%",
                'opacity': 1
            }, {
                duration: 250
            }).draggable({
                handle: '.top_box'
            });
        }
    },

    hide: function() {
        this.open = false;
        $('#load').show();
        var button_position = $('#load').position();

        $('#import').animate({
            "top": $('#buttons').position().top + button_position['top'],
            'left': "2%",
            'width': "0%",
            'height': "0%",
            'opacity': 0
        }, {
            duration: 250,
            complete: function() {
                $(this).hide();
            }
        });

    },

    buttons: function() {

        $('#load').click(function() {
            _self.import.show();
        });

    },

    refresh: function() {
        var json;
        for (var i = 0, len = localStorage.length; i < len; i++) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            try {
                json = JSON.parse(value);
            } catch (e) {
                continue;
            }
            if (json && json['session_file']) {
                this.files.push([key, value]);
            }
        }
    },

    refreshView: function() {
        var folder = '';

        for (var i = 0; i < this.files.length; i++) {
            folder += "<div class='folder' id='" + this.files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + this.files[i][0] + "</div></div>";
        }
        $("#import").children('.box_container').html(folder);

        $('.folder').click(function() {
            _self.import.selectItem($(this));
        });

        $('.folder').click(function() {
            _self.import.loadFile($selectedItem.attr('id'));
            $selectedItem.children('img').css('opacity', 1);
            $selectedItem = undefined;
        });
    },

    selectItem: function(item) {
        if (typeof $selectedItem != "undefined") {
            $selectedItem.children('img').css('opacity', '1');
        }
        $selectedItem = item;
        $selectedItem.children('img').css('opacity', '0.5');
    },

    show_manager: function() {
        $('#import').show().animate({
            'top': "5%",
            'left': "20%",
            'width': "60%",
            'height': "90%",
            'opacity': 1,
            'z-index': 400
        }, {
            duration: 250,
            complete: function() {
                var folder = '';
                var files = _self.import.files;
                for (var i = 0; i < files.length; i++) {
                    folder += "<div class='folder col-lg-3' id='" + files[i][0] + "'><img src='/static/img/folder.png' /><div class='folder_title'>" + files[i][0] + "</div></div>";
                }

                var breadcrumb = "<div class='row-fluid'><div style='line-height:2;margin:0;'";
                breadcrumb += "class='breadcrumb'><li><a id='back_to_load'>Load a session</a> </li>";
                breadcrumb += "<li class='active'>Local Manager</li>";

                breadcrumb += " <li class='pull-right no-before'><button id='load_session_button' class='btn btn-primary btn-sm'>Load</button> ";
                breadcrumb += "<button id='delete_session_button' class='btn btn-danger btn-sm'>Delete</button></li></div></div>";

                $('#top_load_box').html(breadcrumb).slideDown(100);
                $(this).children('.box_container').css('margin', 0).html(folder);

                $('.folder').click(function() {
                    _self.import.selectItem($(this));
                });

                $('.folder').click(function() {
                    if (typeof $selectedItem != "undefined") {
                        _self.import.loadFile($selectedItem.attr('id'));
                        $selectedItem.children('img').css('opacity', 1);
                        $selectedItem = undefined;
                    } else {
                        return false;
                    }
                });

                $('#load_session_button').click(function() {
                    if (typeof $selectedItem != "undefined") {
                        _self.import.loadFile($selectedItem.attr('id'));
                        $selectedItem.children('img').css('opacity', 1);
                        $selectedItem = undefined;
                    } else {
                        return false;
                    }
                });

                $('#delete_session_button').click(function() {
                    if (typeof $selectedItem != "undefined") {
                        _self.import.delete_session($selectedItem.attr('id'));
                        $selectedItem.children('img').css('opacity', 1);
                        $selectedItem.fadeOut(300).remove();
                        $selectedItem = undefined;
                    } else {
                        return false;
                    }
                });

                _self.import.manager = true;

                $('#back_to_load').click(function() {
                    var import_element = $('#import');
                    var back = "<button id='open_load_from_pc' class='btn btn-primary'>Load from File</button> ";
                    back += "<button id='load_from_db' class='btn btn-primary disabled'>Load from your Account</button>";

                    import_element.children('.box_container').html(back);
                    $('#top_load_box').slideUp(100);
                    import_element.show().animate({
                        "top": "14%",
                        'left': "29%",
                        'width': "40%",
                        'height': "25%",
                        'margin': 0,
                        'opacity': 1,
                        'z-index': 400
                    }, {
                        duration: 250,
                        complete: function() {
                            _self.import.manager = false;

                            $('#open_load_from_pc').click(function() {
                                _self.import.show_manager();
                            });
                        }
                    });
                }).draggable();
            }
        });
    },

    delete_session: function(file) {
        if (file in localStorage) localStorage.removeItem(file);
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i][0] == file) {
                this.files.splice(i, 1);
                break;
            }
        }
    },

    loadFile: function(file) {
        var file_session = localStorage.getItem(file);
        _self.import.parse(file_session);
        $('#import').fadeOut();
        $('#load').fadeIn();
    },

    parse: function(file) {
        var json = JSON.parse(file);
        var images = [];
        var comments = [];
        var letters = [];
        var toolbar = json['session_properties']['toolbar'];
        for (var i = 0; i < json['image_properties'].length; i++) {
            images.push(json['image_properties'][i]['image']);
        }
        for (i = 0; i < json['session_properties']['comments'].length; i++) {
            comments.push(json['session_properties']['comments'][i]);
        }
        for (i = 0; i < json['session_properties']['letters'].length; i++) {
            letters.push(json['session_properties']['letters'][i]);
        }
        this.reset();

        _self.import.reloadImages(images, json['image_properties']);
        _self.import.importComments(comments);
        _self.import.importLetters(letters);

        if (toolbar) {
            _self.import.restoreToolbar(toolbar);
        }

        $('html, body').animate({
            scrollTop: json['session_properties']['window']['top'],
            scrollLeft: json['session_properties']['window']['left']
        }, 1000);


    },

    reloadImages: function(images, images_properties) {
        var images_loaded = [];
        var letters = [];
        for (var i = 0; i < images.length; i++) {
            if ((!images_properties[i]['properties']['is_letter'])) {
                $.ajax({
                    type: 'POST',
                    url: 'get-image-manuscript/',
                    data: {
                        'image': images[i]
                    },
                    async: false,
                    beforeSend: function() {

                    },
                    success: function(data) {
                        images_loaded.push(data);
                    },
                    complete: function(data) {

                    }
                });
            } else {
                letters.push(images_properties[i]);
            }
        }
        _self.import.printImages(images_loaded, images_properties);
        _self.import.printLetters(letters);
    },

    printLetters: function(images) {
        for (var i = 0; i < images.length; i++) {
            var src = unescape(images[i]['src']);
            var image = "<div data-size = '" + images[i]['original_size'] + "' class='image_active' id='" + images[i]['image'] + "'><img src='" + unescape(src) + "' /></div>";
            _self.selectors.workspace1.append(image);
            $("#" + images[i]['image']).css({
                "position": "relative",
                "top": images[i]['position']['top'],
                "left": images[i]['position']['left'],
                "max-width": "none",
                "z-index": images[i]['properties']['z-index']
            }).draggable({
                revert: false,
                scroll: true,
                opacity: 0.8,
                stack: '.image_active',
                cursor: "move",
                aspectRatio: true,
                drag: function(ui, event) {
                    position = $(this).offset();
                    //_self.minimap.update_mini_map();
                },
                stop: function(ui, event) {
                    $(ui.helper).css('z-index', 0);
                }
            }).data("is_letter", true).children('img').css({
                "width": images[i]['size']['width'],
                'height': images[i]['size']['height']
            }).resizable({
                aspectRatio: true,
                resize: function(event, ui) {
                    _self.toolbar.refreshSize();
                    event.stopPropagation();
                    return false;
                }
            }).children('img').css({
                "opacity": images[i]['properties']['opacity']
            });

            $('#' + images[i]['image']).dblclick(function(event) {
                _self.select_group.select($(this));
                event.stopPropagation();
            });

            //_self.minimap.add_to_minimap(images[i]['image'], src);
        }
    },


    printImages: function(images, images_properties) {
        for (var i = 0; i < images.length; i++) {
            if (images_properties) {
                var image = '<div data-external="true" data-size = "' + images_properties[i]['original_size'] + '" data-title = "' + images[i][2] + '" class="image_active" id = "' + parseInt(images[i][1]) + '">' + images[i][0] + "<label>" + images[i][2] + "</label> <div class='image_desc col-lg-8 col-md-8 col-xs-8 offset1 image_desc'> <p><b>Manuscript</b>: " + images[i][2] + "</p> " + "<p><b>Repository</b>: " + images[i][3] + "<p><b>Place</b>: " + images[i][4] + "</p></div><br clear='all' /></div>";

                $(image).css({
                    'left': $(window).scrollLeft() + 150,
                    'top': $(window).scrollTop() + 50
                });

                _self.selectors.workspace1.append(image);

                if (images_properties[i]['image'] == images[i][1]) {

                    var image_src = $('#' + images[i][1]).find('img');
                    $('#' + images[i][1]).css({
                        "position": "relative",
                        "top": images_properties[i]['position']['top'],
                        "left": images_properties[i]['position']['left'],
                        "max-width": "none",
                        "max-height": "none",
                        "z-index": images_properties[i]['properties']['z-index']
                    }).draggable({
                        revert: "valid",
                        scroll: true,
                        opacity: 0.7,
                        stack: '.image_active',
                        cursor: "move",
                        drag: function(ui, event) {
                            position = $(this).offset();
                            //_self.minimap.update_mini_map();
                        }
                    }).children('img').css({
                        "opacity": images_properties[i]['properties']['opacity'],
                        "max-width": "none",
                        "width": images_properties[i]['size']['width'],
                        'height': images_properties[i]['size']['height']
                    }).resizable({
                        aspectRatio: true,
                        resize: function(event, ui) {
                            _self.toolbar.refreshSize();
                            event.stopPropagation();
                            return false;
                        }
                    });

                    $("#" + images[i][1]).dblclick(function(event) {
                        _self.select_group.select($(this));
                        event.stopPropagation();
                    });

                    //_self.minimap.add_to_minimap(images[i][1], image_src);
                }

            } else {
                var image = '<div data-external="true" data-size = "' + images[i][4] + '" data-title = "' + images[i][2] + '" class="image" id = "' + parseInt(images[i][1]) + '">' + images[i][0] + " <label>" + images[i][2] + "</label><div class='col-lg-8 col-md-8 col-xs-8 offset1 image_desc'> <p><b>Manuscript</b>: " + images[i][2] + "</p> " + "<p><b>Repository</b>: " + images[i][3] + "<p><b>Place</b>: " + images[i][4] + "</p></div><br clear='all' /></div>";
                $("#hidden_div").append(image);
                _self.imagesBox.imagesSelected.push($(image));
            }
        }

        if (_self.imagesBox.imagesSelected.length) {
            return true;
        }

    },

    importComments: function(comments) {
        _self.comments.notes = comments;
        for (var i = 0; i < comments.length; i++) {
            _self.comments.update_notes(comments[i]);
        }
    },

    importLetters: function(letters) {

        //_self.letters.regions = [];
        for (var i = 0; i < letters.length; i++) {
            for (var j = 0; j < letters[i].letters.length; j++) {
                var letter = $('<img>');
                letter.attr('class', 'letter');
                letter.attr('id', letters[i].letters[j].id);
                letter.attr('src', letters[i].letters[j].src);
                letter.data('size', letters[i].letters[j].size);
                letter.data('manuscript', letters[i].letters[j].manuscript);
                letter.data('manuscript_id', letters[i].letters[j].manuscript_id);
                letter.data('title', letters[i].letters[j].title);
                _self.letters.addLetter(letter);
            }
        }
    },

    restoreToolbar: function(toolbar) {

        _self.toolbar.init();
        _self.toolbar.create(null, true);
        _self.toolbar.refresh();
    },

    reset: function() {
        _self.comments.notes = [];
        _self.workspaceImages.imagesSelected = [];
        _self.letters.lettersSelected = [];
        $('.image_active').remove();
        $('.image').remove();
        $('.letter').remove();
        _self.minimap.clean_minimap();
        _self.comments.clean_notes();
        _self.select_group.imagesSelected = [];
        if (_self.toolbar.exists()) {
            _self.toolbar.toolbox.remove();
        }
    }

};