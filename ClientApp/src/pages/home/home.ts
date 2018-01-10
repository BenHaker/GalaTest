import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  errorMessage: string = "";
  data = {
    url: "",
    isRedirect: false
  }

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {

  }

  submit() {
    if(this.data == null) {
      this.errorMessage = "Internal Error";
      return;
    }

    this.httpClient.post<UserResponse>("http://localhost:3000/", this.data).subscribe(
        data => {
          this.errorMessage = data.error;
          this.data.url = data.url;
//Redirect to the URL the user inserted
          if(this.errorMessage == "" && this.data.isRedirect == false)
            window.open(this.data.url, "_self")
        }
      );
    }
}

interface UserResponse {
  url: string;
  error: string;
}
