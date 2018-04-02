# simple-stack

Extremely simple stack POC for a single node app that serves several PWAs with a common app shell.

## Primary Goal

All requests to node serve the same, static app shell so that the landing page for the entire site is ServiceWorker cacheable. The app shell contains a tiny amount of config and logic detailing all routes and assets needed to render those routes. This means that, no matter which page the browser loads first, it doesn't have to make another round trip to the node app in order to know how to load the other pages within the site.

## Route Handling

Routes are not defined in node. Instead, in order to ensure the app shell remains static and is therefore ServiceWorker cacheable, there is a single catch-all route in node that always returns the same static app shell.

With that in mind, new routes should be defined in a `routesConfig` object that will get baked into the app shell in the `dist` build step. Here's an example `routesConfig` object:

```js
{
  // Match a path to an array of assets
  '/': [ '/index.js' ],
  
  // Match a path to an array of meta tags and an array of assets
  '/about': {
    meta: [ { 'description': 'The coolest page ever!' } ],
    assets: [ '/about.js' ]
  },
  
  // Match a path to a template (as markup) and an array of assets
  '/foo': {
    template: '<Foo />',
    assets: [ '/foo.js' ]
  },
  
  // Match a path to a template (as a URL) and an array of assets
  '/bar': {
    template: '/bar.html',
    assets: [ '/bar.js' ]
  },
  
  // Match a path to a function that returns an object or an array
  '/profile': function profile(){
    if(flag){
      return {
        meta: [ { 'description': 'The second coolest page ever!' } ],
        assets: [ '/profile-new.js' ]
      };
    } else {
      return ['/profile.js'];
    }
}
```
