import {Aurelia} from 'aurelia-framework';
import environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute} from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration().developmentLogging().plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 150;
    })
    // .plugin('aurelia-notification', config => {
    //   config.configure({
    //     translate: false,  // 'true' needs aurelia-i18n to be configured
    //     notifications: {
    //       'success': 'humane-libnotify-success',
    //       'error': 'humane-libnotify-error',
    //       'info': 'humane-libnotify-info'
    //     }
    //   });
    // })
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-notify'))
   aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => { // <------------ 3
    const aliases = ['t', 'i18n']; // <------------ 4
    
    TCustomAttribute.configureAliases(aliases);
       instance.i18next.use(Backend);
       return instance.setup({
         backend: {                                 
           loadPath: './locales/{{lng}}/{{ns}}.json',
         },
         attributes: aliases,
         lng : 'en',
         fallbackLng : 'es',
         whitelist: ['en', 'es', 'zh', 'arab'],
         preload: ['en', 'es', 'zh', 'arab'],
         debug : false
       });
  });

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
