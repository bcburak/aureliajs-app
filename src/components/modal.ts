import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)

export class Prompt {
  controller = null;
  answer = null;
  message = null;
   constructor(controller) {
      this.controller = controller;
      this.answer = null;

      controller.settings.lock = false;
      controller.settings.centerHorizontalOnly = true;
   }
   activate(message) {
      this.message = message;
   }
}
