window.app = {
  routes: {
    // List of assets
    '/': ['/components/index.js'],

    // Object containing list of assets and other data
    '/about': {
      meta: [],
      assets: ['/components/about.js']
    },

    // Function that, based on an experiment value, modifies its assets array
    '/profile': function go(){
      if(window.ex){
        return ['/components/index.js'];
      } else {
        return ['/components/about.js'];
      }
    },

    // Object containing a template key and a hideSpinner flag
    '/gallery': {
      hideSpinner: true,
      template: {
        markup: '<gallery-app>Gallery App</gallery-app>'
      },
      assets: ['/gallery-app.css']
    }
  },

  matchRoute: function(path, routes){
    var keys = Object.keys(routes);
    for(var i = 0; i < keys.length; i++){
      if(path === keys[i]) return keys[i];
    }
    return false;
  },

  loader: {
    loadAssets: function(assets){
      assets.forEach(function(url){
        var tagData = this.getTagData(url);
        this.injectTag(url, tagData);
      }.bind(this));
    },

    getTagData: function(url){
      var ext = this.getExtension(url);
      switch(ext){
        case 'js':    return {tagName: 'script', src: url};                   break;
        case 'css':   return {tagName: 'link', rel: 'stylesheet', href: url};  break;
        case 'html':  return {tagName: 'link', rel: 'import', href: url};      break;
      }
    },

    getExtension: function(url){
      return url.slice(url.lastIndexOf('.') + 1);
    },

    injectTag: function(url, tagData){
      var tag = this.createTag(url, tagData);
      document.getElementsByTagName('head')[0].appendChild(tag);
    },

    createTag: function(url, tagData){
      var tag = document.createElement(tagData.tagName);
      delete tagData.tagName;
      Object.keys(tagData).forEach(function(attr){
        tag.setAttribute(attr, tagData[attr]);
      });
      return tag;
    }

  }
};

var route = app.matchRoute(window.location.pathname, app.routes);
if(route){
  var assets;
  var config = app.routes[route];
  if(typeof config === 'function') assets = config();
  else if(config.assets) assets = config.assets;
  app.loader.loadAssets(assets);

  if(!Array.isArray(config) && typeof config === 'object'){
    var wrapper = document.getElementById('wrapper');
    if(config.template){
      if(config.template.markup){
        wrapper.innerHTML = config.template.markup;
      } else {
        // Fetch markup from CDN URL to dump into the DOM
      }
    }
    if(config.hideSpinner){
      wrapper.classList.remove('spinner');
    }
  }
}
