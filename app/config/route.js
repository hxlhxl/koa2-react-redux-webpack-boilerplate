import Login from 'containers/Login';
import Root from 'containers/Root';


import Welcome from 'containers/Welcome';

function errorLoading(err) {
  console.error('Page loading failed', err);
}

function loadRoute(cb) {
  return (module) => cb(null, module.default);
}

const routes = {
  childRoutes: [{
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Root,
      indexRoute: {
        component: Welcome,
      },
      childRoutes: [{
        path: 'welcome',
        indexRoute: {
          component: Welcome
        }
      }, ]
    }
  ]
};

export default routes;