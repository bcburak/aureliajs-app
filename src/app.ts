import {HttpClient , json} from 'aurelia-fetch-client';
import {DialogService,DialogController} from 'aurelia-dialog';
// import {Notification} from 'aurelia-notification';
import { inject } from 'aurelia-framework';
import {Prompt} from './components/modal'
import {NotificationService} from 'aurelia-notify';
import { RouterConfiguration, Router,NavigationInstruction } from "aurelia-router";
import {PLATFORM} from 'aurelia-pal';

let httpClient = new HttpClient();

var loginDTO = new FormData();
loginDTO.append('grant_type', 'password');
loginDTO.append('email', 'test');
loginDTO.append('password', 'test');

@inject(HttpClient,DialogService,DialogController,NotificationService)
export class App {
  public message = 'Hello World!';
  public firstName = null;
  public lastName = null;
  public age = null;
  public email = null;
  public address = null;
  http = null; 
  dialogService = null;
  controller = null;
  notificationService = null;
  private apiUrl = 'http://jsonplaceholder.typicode.com/posts';
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Aurelia";
    this.router = router;
    const navStrat = (instruction: NavigationInstruction) => {
      instruction.config.moduleId = instruction.fragment
      instruction.config.href = instruction.fragment
    };
 
    config.map([
      { route: ['base', 'user'],       name: 'user',  moduleId: PLATFORM.moduleName('user') },
    ]);
  }

  constructor(http,dialogService,controller,notificationService){
    http.configure(config => {
      config
        .useStandardConfiguration();
    });


    this.http = http;
    this.dialogService = dialogService;
    this.controller = controller;
    this.notificationService = notificationService;

    

    // notification.note('Plain');
    // notification.success('Record created successfully');
    // notification.error('Record creation failed');
    // notification.info('New message');
  }

  ok(message)
  {
    console.log("msg:",message);
    this.controller.ok(message);
  }
  openModal() {
    this.dialogService.open( {viewModel: Prompt, model: 'Are you sure to reset all form?', lock: false  }).whenClosed().then(response => {
       
    
       if (!response.wasCancelled) {
        console.log("resp",response);
        //this.firstName = null;
        //   this.lastName = null;
         this.resetAllInputs();
       } else {
         this.lastName = null;
          console.log('cancelled');
       }
       console.log("respOut",response.output);
    });
 }

postData() {

  const form = new FormData()
    form.append('firstName', this.firstName)
    form.append('lastName', this.lastName)
    form.append('age', this.age)
    form.append('email', this.email)
    form.append('address', this.address)
    
  httpClient.fetch(this.apiUrl, {
     method: "POST",
     body: JSON.stringify(form),
     headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => response.json())
  .then(response => { 
    console.log("postedData");
    this.notificationService.info('Successfully inserted', {timeout: 2000});
    // this.notification.success();
     //your magic here
  });

 

//   doImport() {
//     let form = new FormData()
//     form.append('language', this.languageKey)
//     form.append('file', this.files)
//     //Edit, try this if the first line dont work for you
//     //form.append('file', this.files[0])
 
//     this.http.fetch('YOUR_URL', {
//           method: 'post',
//           body: form
//        })
//        .then(response => {
//           // do whatever here
 
//        });
//  }
}

resetAllInputs(){
  this.firstName = null;
  this.lastName = null;
  this.address = null;
  this.age = null;
  this.email = null;
}

get canReset(){
  // let inputValue = (<HTMLInputElement>document.getElementById(elementId)).value;
  if(this.firstName!= null || this.lastName != null || this.age!=null || this.email!= null || this.address != null)
  return true;
  else
   return false;
} 


}
