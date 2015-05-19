"use strict";
$(function() {

    var self = ''; //For browsersync
    var imported = [{
        "display": "1",
        "tag": "h1",
        "class": "",
        "content": "WELCOME MY SON"
    }, {
        "display": "1",
        "tag": "p",
        "class": "",
        "content": "Lorem ipsum dolor sit amet, {2} dissentiet, duis tollit ancillae ne mea. Te eam diceret facilis reprehendunt, id agam euripidis sed. Eu dicunt insolens mei, timeam efficiantur eos ei, vidisse definitionem ex ius. Possit fabellas et nam, per an tollit ubique noster. His posse feugiat inciderint eu, {3} Ea sea erant tation persius, case omnis aliquip nec in."
    }, {
        "display": 0,
        "tag": "b",
        "class": "",
        "content": "saepe definitiones duo ne, ex cum populo"
    }, {
        "display": 0,
        "tag": "b",
        "class": "",
        "content": "qui ei appetere imperdiet gloriatur."
    }, {
        "display": "1",
        "tag": "p",
        "class": "",
        "content": "Alia partiendo vituperata per te, no cum iusto mediocrem deterruisset. Eleifend ullamcorper mel at, vix et meliore prodesset elaboraret, an denique instructior has. {5} Est an ubique pertinacia, vel ei erat temporibus. Eam ea sint commodo iudicabit, albucius repudiandae ius et."
    }, {
        "display": 0,
        "tag": "span",
        "class": "stylish",
        "content": "In habeo cetero voluptatibus {6}"
    }, {
        "display": 0,
        "tag": "b",
        "class": "",
        "content": "qui."
    }, {
        "display": "1",
        "tag": "h2",
        "class": "",
        "content": "What did you dream?"
    }, {
        "display": "1",
        "tag": "p",
        "class": "",
        "content": "An has affert contentiones, mel enim animal an. Ex mei mazim oblique eleifend, munere dignissim eloquentiam vel ut. Vocent efficiendi vituperatoribus ea quo. Ei odio placerat sit, ne harum noluisse quo. Vel te offendit adipisci. Veri habeo error his no. No noluisse euripidis quaerendum sed."
    }];

    function Editor() {

        //For times when object (this) is out of scope
        self = this;

        //Selection IE fallback
        this.ie = (typeof document.selection != "undefined" && document.selection.type != "Control") && true;
        this.w3 = (typeof window.getSelection != "undefined") && true;
    }

    function Content() {

        var contents = [];

        //Load content nodes array
        if (localStorage.getItem("contents")) {
            contents = JSON.parse(localStorage.getItem("contents"));
            Debug.prototype.setContentStatus('Loaded from localStorage');
        } else {
            contents = imported;
            Debug.prototype.setContentStatus('Loaded from json');
        }
        Debug.prototype.setNodeCount(contents.length);
        Debug.prototype.setJson(JSON.stringify(contents));

        //Loop through contents array
        for (var i = 0; i < contents.length; i++) {

            //Start with first level items only
            if (contents[i]['display']) {

                //Get content html
                var element = buildTag(i, contents[i]);

                //Append to editor
                element.appendTo('#editor');
            }
        };

        function buildTag(i, content) {

            //Check for sub-tags
            contents[i]['content'] = filter(i, contents[i]['content']);

            //Build item html
            var element = $('<' + content['tag'] + '/>', {
                id: i,
                class: content['class'],
                html: content['content']
            });
            return element;
        }

        function filter(i, content) {

            //Match {0-9} in content
            var matches = content.match(/(?=[0-9])(.*?)(?=})/gmi);

            //If there's no matches return the content as is
            if (!matches) {
                return content;
            } else {

                //Loop through the matches
                for (var x = 0; x < matches.length; x++) {

                    //Prepare variable because (this) scope changes in replace function
                    var self = this;

                    //Replace matches with inner html
                    var content = content.replace(/\{([0-9]+)\}/g, function(_, i) {

                        //Get inner tag html (causes a loop back through filter until there are no more child tags)
                        var replacement = buildTag(i, contents[i]);
                        return replacement[0].outerHTML;
                    });
                }
                return content;
            }
        }
    }

    Content.prototype.parseToJson = function(html) {
        var contents = [];
        var parsedContents = [];
        var json = '';

        //Prepare contents from objects
        contents = Content.prototype.setContent(html);

        //Build parsedContents array for saving
        $(contents).each(function(index) {
            parsedContents[index] = {};
            parsedContents[index].display = this.display;
            parsedContents[index].tag = $(this).context.nodeName.toLowerCase();
            parsedContents[index].class = $(this).attr('class');
            parsedContents[index].content = $(this).html();
        });

        //Change to string for localstorage saving
        json = JSON.stringify(parsedContents)
        Debug.prototype.setNodeCount(parsedContents.length);
        Debug.prototype.setJson(json);

        return json;
    }

    Content.prototype.setContent = function(html) {
        var contents = [];

        //First Level Nodes
        $(html).children().each(function(index) {

            //Second Level Nodes
            if ($(this).children().length > 0) {
                $(this).children().each(function() {

                    //Third Level Nodes
                    if ($(this).children().length > 0) {
                        $(this).children().each(function() {

                            //Third Level Nodes
                            this.display = 0;
                            contents.push(this);
                            $(this).replaceWith("{" + (contents.length - 1) + "}");
                        });
                    }

                    //Second Level Nodes
                    this.display = 0;
                    contents.push(this);
                    $(this).replaceWith("{" + (contents.length - 1) + "}");
                });
            }

            //First Level Nodes
            this.display = 1;
            contents.push(this);
        });
        return contents;
    }


    function Events() {

        //Hide Tooltip on click anywhere
        $('html').on('click', function() {
            $('.tip').remove();
            $('.tooltip').hide();
        })

        //Show tooltip on keyup (arrows only), click and focus
        $('#editor').on("keyup click", function(event) {

            //Hide elements
            $('.tooltip').hide();
            $('.tip').remove();

            //Hide it if it's not an arrow keyup
            if (typeof event.keyCode !== 'undefined' && event.keyCode != 37 &&
                event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40) {
                return;
            } else {

                //Or else show Tooltip
                Tools.prototype.showTooltip(this);
                event.stopPropagation();
            }
        });

        //Add emoji or icon on click and trigger update event
        $(".options span").on('click', function(event) {
            $('.tip').replaceWith($(this)[0].outerHTML);
            $('#editor').trigger('update');
            $('.tooltip').hide();
        });

        //Toggle between emoji and icon
        $('.tab').on('click', function(event) {
            $('.tab').removeClass('active');
            $(this).addClass('active');
            $('.tabcontent').removeClass('active');
            $('.tabcontent.' + $(this).data('toggle')).addClass('active');
            event.stopPropagation();
        });

        //Save editor to localStorage on input, change or update
        $('#editor').on('input change update', function() {
            var json = Content.prototype.parseToJson($(this)[0].outerHTML);
            localStorage.setItem("contents", json);
            Debug.prototype.setLocalStorage();
        });
    }

    function Tools() {}

    Tools.prototype.showTooltip = function(element) {
        this.setCaret(element);
        this.setTooltip();
    }

    Tools.prototype.setCaret = function(element) {
        var sel;
        var range;
        var element = $('<div/>', {
            html: '<span class="tip" contenteditable="true"></span>'
        });
        if (self.w3) {

            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {

                //Setup fragment and nodes
                //https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment Document.createDocumentFragment() 
                var frag = document.createDocumentFragment(), node, lastNode;
                lastNode = frag.appendChild(element[0].firstChild);

                //Insert with range
                range = sel.getRangeAt(0);
                range.insertNode(frag);
            }
        } else if (this.ie) {
            // IE < 9
        }
    }

    Tools.prototype.setTooltip = function() {

        //Check that tip is on the page
        if ($('.tip').length > 0) {

            //Absolute position tooltip relative to .tip
            var x = $('.tip').offset().left;
            var y = $('.tip').offset().top;
            $('.tooltip').css({
                'top': y,
                'left': x,
                'display': 'block'
            });
        }
    }

    function Debug() {

        //Empty localStorage on click
        $('.clearLocalStorage').on('click', function() {
            localStorage.removeItem("contents");
        });
    }

    Debug.prototype.setContentStatus = function(value) {
        $('.contentStatus').html(value);
    }

    Debug.prototype.setLocalStorage = function(value) {
        var newDate = new Date();
        var datetime = newDate.today() + " @ " + newDate.timeNow();
        $('.localStorage').html('Synchronized at ' + datetime);
    }

    Debug.prototype.setNodeCount = function(value) {
        $('.nodeCount').html(value);
    }

    Debug.prototype.setJson = function(value) {
        $('.json').html(value);
    }

    Debug.prototype.setCaretPosition = function(value) {
        $('.caretPosition').html(value);
    }

    //Init
    var editor = new Editor();
    editor.content = new Content();
    editor.events = new Events();
    editor.debug = new Debug();
    $(window).resize(function() {
        Tools.prototype.setTooltip();
    });
});

// For todays date;
Date.prototype.today = function() {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}