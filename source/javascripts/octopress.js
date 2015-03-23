function addSidebarToggler() {
  var sections = $('aside.sidebar > section');
  if (sections.length > 1) {
    sections.each(function(index, section){
      if ((sections.length >= 3) && index % 3 === 0) {
        $(section).addClass("first");
      }
      var count = ((index +1) % 2) ? "odd" : "even";
      $(section).addClass(count);
    });
  }
  if (sections.length >= 3){ $('aside.sidebar').addClass('thirds'); }
}

function addCodeLineNumbers() {
  if (navigator.appName === 'Microsoft Internet Explorer') { return; }
  $('div.gist-highlight').each(function(code) {
    var tableStart = '<table><tbody><tr><td class="gutter">',
        lineNumbers = '<pre class="line-numbers">',
        tableMiddle = '</pre></td><td class="code">',
        tableEnd = '</td></tr></tbody></table>',
        count = $('.line', code).length;
    for (var i=1;i<=count; i++) {
      lineNumbers += '<span class="line-number">'+i+'</span>\n';
    }
    var table = tableStart + lineNumbers + tableMiddle + '<pre>'+$('pre', code).html()+'</pre>' + tableEnd;
    $(code).html(table);
  });
}

function wrapFlashVideos() {
  $('object').each(function(i, object) {
    if( $(object).find('param[name=movie]').length ){
      $(object).wrap('<div class="flash-video">')
    }
  });
  $('iframe[src*=vimeo],iframe[src*=youtube]').wrap('<div class="flash-video">')
}

function renderDeliciousLinks(items) {
  var output = "<ul>";
  for (var i=0,l=items.length; i<l; i++) {
    output += '<li><a href="' + items[i].u + '" title="Tags: ' + (items[i].t == "" ? "" : items[i].t.join(', ')) + '">' + items[i].d + '</a></li>';
  }
  output += "</ul>";
  $('#delicious').html(output);
}

function setHeroImage(){
  var heroData = $('#hero-href');
  if(heroData.length){
    var heroHref = heroData.attr('data-href');
    var hero = $('.hero');
    if(heroHref.length){
      hero.addClass('hero-post').css({'background-image': 'url("' + heroHref + '")'})
    }
    else {
      hero.remove();
    }
  }
}

// Mobile dropdown object and action binding
var mobileDropdown = {
  body: $('.main-navigation').clone(true).attr('id', 'mobile-dropdown'),
  trigger: $('<span id="mobile-dropdown-trigger">'),
  bannerNav: $('nav[role="navigation"]'),
  isOpen: false,
  toggle: function() {
    if (this.isOpen) {
      this.body.removeClass('dropdown-show');
      this.isOpen = false;
      return true;
    } else {
      this.body.addClass('dropdown-show');
      this.isOpen = true;
      return false;
    }
  },
  init: function() {
    var _this = this;
    this.body.on('click', function() {
      _this.toggle();
    });
    this.trigger.on('click', function() {
      _this.toggle();
    });
    this.bannerNav.append(this.body);
    this.bannerNav.append(this.trigger);
  }
};


$('document').ready(function() {
  wrapFlashVideos();
  addCodeLineNumbers();
  addSidebarToggler();
  setHeroImage();
  mobileDropdown.init();
});


// iOS scaling bug fix
// Rewritten version
// By @mathias, @cheeaun and @jdalton
// Source url: https://gist.github.com/901295
(function(doc) {
  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }
  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [0.25, 1.6];
    doc[addEvent](type, fix, true);
  }
}(document));
